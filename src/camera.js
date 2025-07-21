let usandoFrontal = true;
let streamAtual = null;

export function iniciarCamera() {
  const video = document.getElementById('video');

  if (streamAtual) {
    streamAtual.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: {
      facingMode: usandoFrontal ? "user" : { exact: "environment" }
    },
    audio: false
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      streamAtual = stream;
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Erro ao acessar câmera:", err);
      alert("Permita o uso da câmera para continuar.");
    });

  const botaoTrocar = document.getElementById("trocarCamera");
  if (botaoTrocar && !botaoTrocar.dataset.listener) {
    botaoTrocar.dataset.listener = "true";
    botaoTrocar.addEventListener("click", () => {
      usandoFrontal = !usandoFrontal;
      iniciarCamera();
    });
  }
}

export function capturarFoto() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  return canvas.toDataURL('image/png');
}
