import pandas as pd
from flask import Flask, render_template, request
import pickle
import json
from mysql.connector import Error ,connect
app = Flask(__name__)
def preprocess_new_data(df, df_new, label_encoders=None, scaler=None):
    try:
        if label_encoders:
            for col, le in label_encoders.items():
                # Combine original data and new data to ensure all labels are seen
                combined_data = pd.concat([df[col], df_new[col]])
                le.fit(combined_data)
                df[col] = le.transform(df[col])
    except Exception as e:
        print(f'Error: {e}')
        
    if scaler:
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns 
        df[numeric_cols] = scaler.transform(df[numeric_cols])
        
    if label_encoders:
        print(label_encoders.items())
        
    return df

with open('models/label_encoders_and_scaler.pkl', 'rb') as f:
    label_encoders, scaler = pickle.load(f)
model = pickle.load(open('models/random_forest_model.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/analyse')
def analyse():
    return render_template('analyse.html')
@app.route('/about')
def about():
    return render_template('about.html')
@app.route('/Prediction')
def Prediction():
    return render_template('predict.html')
@app.route('/contact')
def contact(): 
    return render_template('contact.html')
# Your existing Flask code here...
data_final =pd.read_csv('data/final_data.csv')
@app.route('/predict', methods=['POST'])
def predict():
    global model
    try:
        # Get form data
        City = request.form.get('City')
        Localisation = request.form.get('Localisation')
        Type = request.form.get('Type')
        Area = float(request.form.get('Area'))  # Convert to float
        Rooms = float(request.form.get('Rooms'))  # Convert to float
        Bedrooms = float(request.form.get('Bedrooms'))  # Convert to float
        Bathrooms = float(request.form.get('Bathrooms'))
        Floor = float(request.form.get('Floor'))
        Current_state = request.form.get('Current_state')
        Age = request.form.get('Age')

        cust = {
            'Type': [Type],
            'Localisation': [Localisation],
            'City': [City],
            'Area': [Area],
            'Rooms': [Rooms],
            'Bedrooms': [Bedrooms],
            'Bathrooms': [Bathrooms],
            'Floor': [Floor],
            'Current_state': [Current_state],
            'Age': [Age],
        }
        df_new = pd.DataFrame(cust, index=[0])
        df = data_final.sample(10)
        df.drop(columns=['Price'],inplace=True)
        df_new = pd.concat([df_new, df], ignore_index=True)
        feature_order = ['Type', 'Localisation', 'City', 'Area', 'Rooms', 'Bedrooms', 'Bathrooms', 'Floor', 'Current_state', 'Age']
        df_new = df_new[feature_order]
        cust_transformed = preprocess_new_data(df_new, df_new, label_encoders=label_encoders, scaler=scaler)
        prediction = model.predict(cust_transformed)
        predicted_price = prediction[0].round(2)
        score = 0.90  # Remplacez par le score général du modèle
        prediction_text = "Predicted price: {} DH".format(predicted_price)
        score = "Score: {}%".format(score)
        return json.dumps({'prediction': prediction_text, 'score' :score})
    except Exception as e:
        return json.dumps({'error': str(e)})


@app.route('/SendContact', methods=['POST'])
def SendContact():
    try:
        nom = request.form.get('nom')
        prenom = request.form.get('prenom')  # Corrigé de 'renom' à 'prenom'
        email = request.form.get('Email')
        object_ = request.form.get('Object')
        message = request.form.get('Message')
        try:
            # Connexion à la base de données
            connection = connect(
                host='localhost',
                database='stage',
                user='root',
                password=''
            )

            if connection.is_connected():
                cursor = connection.cursor()

                # Requête SQL pour insérer les données dans la table 'contact'
                sql_insert_query = """
                INSERT INTO contact (nom, prenom, email, object, message)
                VALUES (%s, %s, %s, %s, %s)
                """

                # Exécution de la requête
                cursor.execute(sql_insert_query, (nom, prenom, email, object_, message))

                # Validation de la transaction
                connection.commit()
                contact_text = "Le message a été envoyé avec succès"
                print("Données insérées avec succès")

        except Error as e:
            print(f"Erreur lors de la connexion à MySQL : {e}")
            return json.dumps({'error': str(e)})
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
                print("Connexion MySQL fermée")

        return json.dumps({'Contact': contact_text})
    
    except Exception as e:
        return json.dumps({'error': str(e)})
        
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
