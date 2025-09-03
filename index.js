let player; // Variable global para controlar el iframe

metodos = ["a14n", "a16", "v2"]
// Carga el iframe de YouTube y crea el reproductor



function openVideo() { 
  videoId = 'eBhwcV8stiU'; // <-- remplaza con el ID del video real
  const modal = document.getElementById('videoModal');
  modal.classList.remove('hidden');
  const params = new URLSearchParams(window.location.search);

  // Accedemos a un parámetro llamado "nombre"
  const metodo = params.get("met");
  // Comprueba si el metodo se encuentra en la lista metodos 

  if (metodos.includes(metodo)) {
      videoId = 'KooISRw98jc'; // <-- remplaza con el ID del video real
  }

  if (!player) {
    player = new YT.Player('youtubePlayer', {
      videoId: videoId, // <-- remplaza con el ID del video real
      events: {
        'onReady': (event) => {
          event.target.playVideo();
        }
      }
    });
  } else {
    player.seekTo(0);
    player.playVideo();
  }
    openVideoLog(metodo);
}

function closeVideo() {
  const modal = document.getElementById('videoModal');
  const params = new URLSearchParams(window.location.search);

  // Accedemos a un parámetro llamado "nombre"
  const metodo = params.get("met");

  if (player && player.getCurrentTime) {
    const currentTime = player.getCurrentTime();
    console.log(`Video cerrado en el segundo: ${currentTime.toFixed(2)}`);
    closeVideoLog(currentTime.toFixed(2), metodo);
  }

  if (player && player.pauseVideo) {
    player.pauseVideo();
  }

  modal.classList.add('hidden');
}




function openVideoLog(metodo) {
      
      console.log("Se hizo click en el video");
      let idUser = localStorage.getItem("idUser");
      if (!idUser) {
        idUser = crypto.randomUUID(); // Genera un ID único
        localStorage.setItem("idUser", idUser);
      }
      sendInfoToServer(idUser, metodo);
    }

function closeVideoLog(tiempo, metodo) {
    
    let idUser = localStorage.getItem("idUser");
    if (!idUser) {
        idUser = crypto.randomUUID(); // Genera un ID único
        localStorage.setItem("idUser", idUser);
    }

    sendDesconectionToServer(idUser, metodo, new Date(), tiempo);


}
function sendDesconectionToServer(idUser, metodo, fecha = new Date(), tiempo = 0) {
    const fechaMadrid = fecha.toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
    fetch('https://hook.eu2.make.com/h5d2zc7wyrdwwpi5anml06nio852vag2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idUser: idUser,
            metodo: metodo,
            fecha: fechaMadrid,
            tiempo: tiempo
        })
    }).then(response => {
        if (!response.ok) {
            console.error("Error al enviar los datos:", response.statusText);
        } else {
            console.log("Datos enviados correctamente");
        }
    }).catch(error => {
        console.error("Error de red:", error);
    });
}
function sendInfoToServer(idUser, metodo, fecha = new Date()) {
    const fechaMadrid = fecha.toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

    fetch('https://hook.eu2.make.com/9gl1548kye7e2c57iphjv9vjzy2245bo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idUser: idUser,
            metodo: metodo,
            fecha: fechaMadrid
        })
    }).then(response => {
        if (!response.ok) {
            console.error("Error al enviar los datos:", response.statusText);
        } else {
            console.log("Datos enviados correctamente");
        }
    }).catch(error => {
        console.error("Error de red:", error);
    });
}

window.addEventListener("pagehide", () => {
  const params = new URLSearchParams(window.location.search);
  const metodo = params.get("met") || "pagehide";

  if (player && player.getCurrentTime) {
    const currentTime = player.getCurrentTime();
    closeVideoLog(currentTime.toFixed(2), metodo);
  }
});

window.addEventListener("beforeunload", () => {
  const params = new URLSearchParams(window.location.search);
  const metodo = params.get("met") || "beforeunload";

  if (player && player.getCurrentTime) {
    const currentTime = player.getCurrentTime();
    closeVideoLog(currentTime.toFixed(2), metodo);
  }
});

function openForm() {
  const formModal = document.getElementById('formModal');
  formModal.classList.remove('hidden');
}

function showForm(type) {
    document.getElementById('choiceStep').classList.add('hidden');
    if (type === 'negocio') {
      document.getElementById('formNegocio').classList.remove('hidden');
    } else {
      document.getElementById('formVender').classList.remove('hidden');
    }
  }

function closeForm() {
  const formModal = document.getElementById('formModal');
  formModal.classList.add('hidden');
  document.getElementById('choiceStep').classList.remove('hidden');
  document.getElementById('formNegocio').classList.add('hidden');
  document.getElementById('formVender').classList.add('hidden');
}

function submitForm(event,tipo) {
  event.preventDefault();
  // Aquí puedes manejar el envío del formulario
  sendData(tipo);
  closeForm();
  showPopupConfirmation();
}

function sendData(tipo) {
  let data = {};
  if (tipo === 'negocio') {
    const name = document.getElementById('nameNegocio').value.trim();
    const phone = document.getElementById('phoneNegocio').value.trim();
    const sector = document.getElementById('sectorNegocio').value.trim();
    const web = document.getElementById('webNegocio').value.trim();
    data = {
        tipo: tipo,
        name: name,
        phone: phone,
        sector: sector,
        web: web,
    };
  }else{
    const name = document.getElementById('nameVender').value.trim();
    const phone = document.getElementById('phoneVender').value.trim();
    const email = document.getElementById('emailVender').value.trim();
    data = {
        tipo: tipo,
        name: name,
        phone: phone,
        email: email,
    };
  }

    

    fetch('https://hook.eu2.make.com/9gl1548kye7e2c57iphjv9vjzy2245bo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            showPopupConfirmation();
            closeForm();
        } else {
            alert('Hubo un error al enviar los datos. Inténtalo de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error al conectar con el servidor.');
    });
}


function showPopupConfirmation() {
    // Crear el contenedor del popup
    const popup = document.createElement('div');
    popup.id = 'confirmationPopup';
    popup.className = 'fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center';

    // Contenido del popup
    popup.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center relative animate-fadeIn">
            <button onclick="closePopupConfirmation()" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            <h2 class="text-2xl font-bold text-green-600 mb-2">¡Datos enviados con éxito!</h2>
            <p class="text-gray-700 mb-4">Nuestro equipo se pondrá en contacto contigo lo antes posible para que puedas probar la herramienta.</p>
            <button onclick="closePopupConfirmation()" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-all">Cerrar</button>
        </div>
    `;

    document.body.appendChild(popup);
}

function closePopupConfirmation() {
    const popup = document.getElementById('confirmationPopup');
    if (popup) popup.remove();
}

