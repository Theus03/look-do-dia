export function iniciarCamera() {
  const video = document.getElementById('video');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Erro ao acessar câmera:", err);
      alert("Permita o uso da câmera para continuar.");
    });
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
