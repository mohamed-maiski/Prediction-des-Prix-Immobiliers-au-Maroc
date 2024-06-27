
let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{
    navbar.classList.toggle('active');
    menu.classList.toggle('fa-times');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    menu.classList.remove('fa-times');
}
//? ------------------------------------------------------------------
//? --------------------  Predict  page  -----------------------------
//? ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        const formData = new FormData(form);

        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            const jsonData = JSON.parse(data);
            function formatNumber(number) {
              return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
            document.getElementById('predicted-price').innerHTML = formatNumber(jsonData.prediction);
            document.getElementById('score-price').innerHTML = jsonData.score;
            console.log(jsonData.mode)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
// 
function toggleDetails() {
    var details = document.getElementById("model-details");
    var btn = document.querySelector(".show-details-btn");
    if (details.style.height === "0px") {
      details.style.height = "290px";
      btn.innerHTML = "Massquer les Détails du Modèle";
    } else {
      details.style.height = "0px";
      btn.innerHTML = "Afficher les Détails du Modèle";
    }
  }
  // 
  function showTable() {
    if (document.querySelector('.tableFixHead').style.width=== '0px') {
      document.querySelector('.tableFixHead').style.width= '94%';
      document.querySelector('.tableFixHead').style.visibility= 'visible';
      document.querySelector('.table').innerHTML= '<i class="fa-solid fa-x"></i>';
    } else {
      document.querySelector('.tableFixHead').style.width= '0px';
      document.querySelector('.tableFixHead').style.visibility= 'hidden';
      document.querySelector('.table').innerHTML= '<i class="fa-solid fa-table"></i>';
    }
  }
  // 
  const areas = {
    rabat: ['Haut Agdal', 'Souissi', 'Riyad', 'Quartier Des Ambassades', 'Agdal', 'Hassan - Centre Ville', "L'Ocean", 'Aviation - Mabella', 'Diour Jamaa', 'Guich Oudaya', 'Les Orangers', 'Médina', 'Hay El Menzah', 'Hay Al Kora', 'Hay Nahda', 'Hay Al Fath', 'Hay Ach-chbanat', 'El Youssoufia', 'Hay Al Rajaa Fillah', 'Hay Al Amal', 'Al Kouass', 'Kébibat', 'Quartier Administratif', 'Al Irfane', 'Bouitate', 'Al Kamra', 'Hay Al Massira', 'Hay Bouhlal', 'Les Oudayas', 'Takadoum', 'Akkari', 'Abi Ragrag', 'Riyad Extension', 'Karrakchou', 'Hay Al Farah', 'Hassan'],
    casablanca: ['Californie ', 'Ahl Loghlam (Hay Assalam) ', 'Les Hôpitaux ', 'Longchamps (Hay Al Hanâa) ', 'Bourgogne Ouest ', 'Ain Diab ', 'Sidi Maarouf ', 'Belvédère ', 'Ain Chock ', 'Al Farah Dar Essalam ', 'Habbous ', 'Oasis ', 'CIL (Hay Salam) ', 'Anfa ', 'Anfa Supérieur ', 'Alsace Lorraine ', 'Maârif Extension ', 'Lissasfa ', "Triangle d'Or ", 'Zone Industrielle Moulay Rachid ', 'Riviera ', 'Roches Noires ', 'Polo ', 'Hay Almasjid ', 'Derb Omar ', 'Oulfa ', 'Palmier ', 'Les princesses ', 'Racine ', 'Casablanca Finance City ', 'Ferme Bretonne (Hay Arraha) ', 'Gauthier ', 'Racine Extension ', 'Bourgogne Est ', 'El Manar - El Hank ', 'Derb Khalid ', 'Maârif ', 'Ain Borja ', 'La Vilette ', 'Quartier Bachkou ', 'Burger ', 'Derb Ghalef ', 'Hay Albaraka ', 'Aïn Sebaâ ', 'Hay Hassani ', 'Centre Ville ', 'Beauséjour ', 'Michouar ', 'Hay Moulay Abdellah ', 'La Gironde ', 'Hay Zobir ', 'Franceville ', 'Ain Diab Extension ', 'Casablanca Marina ', 'Laymoune ', 'Oasis sud ', 'Jamila 5 ', 'Hermitage ', 'Derb Moulay Cherif ', 'Mers Sultan ', 'Tantonville ', 'Val Fleury ', 'Hay Inara ', 'Lekrimat ', 'Dar Lamane ', 'Sidi Moumen ', 'Anassi ', 'Les Crêtes ', 'Al Qods ', 'Ifriquia ', 'Derb Ben Houmane ']
  };

  function populateAreas(city) {
    const areaSelect = document.getElementById('select-state');

    // Clear previous options
    areaSelect.innerHTML = '';

    if (city in areas) {
      areas[city].forEach(area => {
        const option = document.createElement('option');
        option.text = area;
        option.value = area;
        areaSelect.appendChild(option);
      });
    } else {
      const defaultOption = document.createElement('option');
      defaultOption.text = 'Invalid city';
      areaSelect.appendChild(defaultOption);
    }
  }

  // Call the function with the desired city
  populateAreas('casablanca');
  // 
  new TomSelect("#select-state", {
    create: false,
    sortField: {
      field: "text",
      direction: "asc"
    }
  });