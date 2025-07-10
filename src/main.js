import { iniciarCamera, capturarFoto } from './camera.js';
import { salvarLook } from './db.js';

iniciarCamera();

document.getElementById('btnCapturar').addEventListener('click', async () => {
  const preview = document.getElementById('preview');
  const mensagem = document.getElementById('mensagem');
  const imagem = capturarFoto();

  preview.style.width = "80%";
  preview.src = imagem;

  try {
    await salvarLook(imagem);
    mensagem.textContent = "Look salvo com sucesso!";
    setTimeout(() => mensagem.textContent = "", 3000);
  } catch (err) {
    mensagem.textContent = "Erro ao salvar o look!";
    mensagem.style.color = "red";
  }
});
