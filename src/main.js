import { iniciarCamera, capturarFoto } from './camera.js';
import { salvarLook } from './db.js';

iniciarCamera();

document.getElementById('btnCapturar').addEventListener('click', async () => {
  const preview = document.getElementById('preview');
  const alertSuccess = document.getElementById('alertSuccess');
  const alertDanger = document.getElementById('alertSuccess');
  const imagem = capturarFoto();

  preview.style.width = "80%";
  preview.src = imagem;

  try {
    await salvarLook(imagem);
    alertSuccess.style.display = 'flex';
    setTimeout(() => alertSuccess.style.display = 'none', 3000);
  } catch (err) {
    alertDanger.style.display = 'flex';
    setTimeout(() => alertDanger.style.display = 'none', 3000);
  }
});
