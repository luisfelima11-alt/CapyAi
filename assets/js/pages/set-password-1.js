document.getElementById('reset-form').addEventListener('submit', async event => {
      event.preventDefault();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm').value;
      const message = document.getElementById('message');
      message.className = 'error';
      if (password.length < 12) { message.textContent = 'Use pelo menos 12 caracteres.'; return; }
      if (password !== confirm) { message.textContent = 'As senhas não coincidem.'; return; }
      try {
        const user = await Auth.ready();
        if (!user) throw new Error('O link expirou. Solicite uma nova recuperação.');
        await Auth.setPassword(password);
        message.className = 'success';
        message.textContent = 'Senha atualizada. Redirecionando…';
        setTimeout(() => { window.location.href = '6_Home_Forest_Expedition.html'; }, 1200);
      } catch (error) {
        message.textContent = error.message || 'Não foi possível atualizar a senha.';
      }
    });
