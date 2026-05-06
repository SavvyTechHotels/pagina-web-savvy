(function () {
  const MODAL_ID = 'savvy-contact-modal';

  function injectModal() {
    if (document.getElementById(MODAL_ID)) return;

    const el = document.createElement('div');
    el.id = MODAL_ID;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'savvy-modal-title');
    el.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;';

    el.innerHTML = `
      <!-- Overlay -->
      <div id="savvy-modal-overlay"
           style="position:absolute;inset:0;background:rgba(14,65,89,0.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      </div>

      <!-- Panel -->
      <div id="savvy-modal-panel"
           style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                  width:92%;max-width:500px;max-height:92vh;overflow-y:auto;
                  background:#fff;border-radius:4px;box-shadow:0 24px 64px rgba(0,0,0,0.18);
                  font-family:'Montserrat',sans-serif;">

        <!-- Header -->
        <div style="background:#0e4159;padding:28px 32px 24px;position:relative;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(165,201,215,.8);">Savvy Tech Hotels</p>
          <h2 id="savvy-modal-title" style="margin:0;font-size:22px;font-weight:300;color:#fff;letter-spacing:-.02em;">Reserva tu demo gratuita</h2>
          <p style="margin:8px 0 0;font-size:13px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.5;">Te llamamos en menos de 24 h para mostrarte cómo Savvy funciona en tu hotel.</p>
          <button id="savvy-modal-close"
                  aria-label="Cerrar"
                  style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,.1);border:none;
                         cursor:pointer;width:32px;height:32px;border-radius:2px;display:flex;align-items:center;
                         justify-content:center;color:#fff;font-size:20px;transition:background .2s;"
                  onmouseover="this.style.background='rgba(255,255,255,.2)'"
                  onmouseout="this.style.background='rgba(255,255,255,.1)'">
            <span class="material-symbols-outlined" style="font-size:18px;">close</span>
          </button>
        </div>

        <!-- Form -->
        <form id="savvy-contact-form" novalidate style="padding:28px 32px 32px;">
          <!-- Honeypot anti-spam -->
          <input name="honeypot" type="text" tabindex="-1" autocomplete="off"
                 style="position:absolute;left:-9999px;opacity:0;pointer-events:none;" />

          <div style="display:grid;gap:16px;">

            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0e4159;margin-bottom:6px;">
                Nombre <span style="color:#e53e3e;">*</span>
              </label>
              <input name="nombre" type="text" required autocomplete="name"
                     placeholder="Tu nombre completo"
                     style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:3px;
                            font-family:'Montserrat',sans-serif;font-size:14px;color:#0f172a;
                            outline:none;transition:border-color .2s;box-sizing:border-box;"
                     onfocus="this.style.borderColor='#0e4159'"
                     onblur="this.style.borderColor='#e2e8f0'" />
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0e4159;margin-bottom:6px;">
                Hotel / Empresa
              </label>
              <input name="hotel" type="text" autocomplete="organization"
                     placeholder="Nombre de tu hotel o empresa"
                     style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:3px;
                            font-family:'Montserrat',sans-serif;font-size:14px;color:#0f172a;
                            outline:none;transition:border-color .2s;box-sizing:border-box;"
                     onfocus="this.style.borderColor='#0e4159'"
                     onblur="this.style.borderColor='#e2e8f0'" />
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0e4159;margin-bottom:6px;">
                  Teléfono <span style="color:#e53e3e;">*</span>
                </label>
                <input name="telefono" type="tel" required autocomplete="tel"
                       placeholder="+34 600 000 000"
                       style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:3px;
                              font-family:'Montserrat',sans-serif;font-size:14px;color:#0f172a;
                              outline:none;transition:border-color .2s;box-sizing:border-box;"
                       onfocus="this.style.borderColor='#0e4159'"
                       onblur="this.style.borderColor='#e2e8f0'" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0e4159;margin-bottom:6px;">
                  Email <span style="color:#e53e3e;">*</span>
                </label>
                <input name="email" type="email" required autocomplete="email"
                       placeholder="tu@hotel.com"
                       style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:3px;
                              font-family:'Montserrat',sans-serif;font-size:14px;color:#0f172a;
                              outline:none;transition:border-color .2s;box-sizing:border-box;"
                       onfocus="this.style.borderColor='#0e4159'"
                       onblur="this.style.borderColor='#e2e8f0'" />
              </div>
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0e4159;margin-bottom:6px;">
                Mensaje <span style="color:#94a3b8;font-weight:400;">(opcional)</span>
              </label>
              <textarea name="mensaje" rows="3"
                        placeholder="¿Algo que quieras contarnos antes de la demo?"
                        style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:3px;
                               font-family:'Montserrat',sans-serif;font-size:14px;color:#0f172a;
                               outline:none;transition:border-color .2s;resize:vertical;
                               box-sizing:border-box;line-height:1.5;"
                        onfocus="this.style.borderColor='#0e4159'"
                        onblur="this.style.borderColor='#e2e8f0'"></textarea>
            </div>

            <!-- Submit -->
            <button id="savvy-submit-btn" type="submit"
                    style="width:100%;padding:14px 24px;background:#0e4159;color:#fff;border:none;
                           border-radius:3px;font-family:'Montserrat',sans-serif;font-size:12px;
                           font-weight:700;letter-spacing:.15em;text-transform:uppercase;
                           cursor:pointer;transition:background .2s,transform .15s;margin-top:4px;"
                    onmouseover="if(!this.disabled)this.style.background='#0a3347'"
                    onmouseout="if(!this.disabled)this.style.background='#0e4159'">
              Solicitar demo gratuita
            </button>

            <!-- Feedback -->
            <div id="savvy-form-feedback" style="display:none;"></div>

          </div>
        </form>
      </div>
    `;

    document.body.appendChild(el);

    // Event listeners
    document.getElementById('savvy-modal-close').addEventListener('click', closeModal);
    document.getElementById('savvy-modal-overlay').addEventListener('click', closeModal);
    document.getElementById('savvy-contact-form').addEventListener('submit', handleSubmit);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) { injectModal(); modal = document.getElementById(MODAL_ID); }
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var first = modal.querySelector('input[name="nombre"]');
      if (first) first.focus();
    }, 50);
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var btn = document.getElementById('savvy-submit-btn');
    var feedback = document.getElementById('savvy-form-feedback');

    var nombre = form.nombre.value.trim();
    var email = form.email.value.trim();
    var telefono = form.telefono.value.trim();

    if (!nombre || !email || !telefono) {
      showFeedback(feedback, 'error', 'Por favor, rellena los campos obligatorios.');
      return;
    }

    btn.disabled = true;
    btn.style.background = '#94a3b8';
    btn.textContent = 'Enviando…';
    feedback.style.display = 'none';

    try {
      var res = await fetch('https://vmi3024621.contaboserver.net/webhook/savvy-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          hotel: form.hotel.value.trim(),
          telefono: telefono,
          email: email,
          mensaje: form.mensaje.value.trim(),
          honeypot: form.honeypot.value,
        }),
      });

      if (res.ok) {
        showSuccess(form, btn, feedback);
      } else {
        throw new Error();
      }
    } catch (_) {
      btn.disabled = false;
      btn.style.background = '#0e4159';
      btn.textContent = 'Solicitar demo gratuita';
      showFeedback(feedback, 'error', 'Ha ocurrido un error. Escríbenos a <a href="mailto:yago@savvytechhotels.com" style="color:#0e4159;font-weight:600;">yago@savvytechhotels.com</a>');
    }
  }

  function showSuccess(form, btn, feedback) {
    form.style.padding = '40px 32px';
    form.innerHTML = `
      <div style="text-align:center;">
        <div style="width:56px;height:56px;background:#f0f7fa;border-radius:50%;display:flex;
                    align-items:center;justify-content:center;margin:0 auto 20px;">
          <span class="material-symbols-outlined" style="font-size:28px;color:#0e4159;">check_circle</span>
        </div>
        <h3 style="margin:0 0 10px;font-size:18px;font-weight:600;color:#0e4159;">¡Solicitud recibida!</h3>
        <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
          El equipo de Savvy Tech Hotels se pondrá en contacto contigo en menos de 24 h para confirmar la demo.<br>
          Revisa también tu bandeja de spam.
        </p>
        <button onclick="document.getElementById('${MODAL_ID}').style.display='none';document.body.style.overflow='';"
                style="padding:10px 28px;background:#0e4159;color:#fff;border:none;border-radius:3px;
                       font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;
                       letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">
          Cerrar
        </button>
      </div>
    `;
  }

  function showFeedback(el, type, msg) {
    el.style.display = 'block';
    el.style.padding = '12px 16px';
    el.style.borderRadius = '3px';
    el.style.fontSize = '13px';
    el.style.lineHeight = '1.5';
    if (type === 'error') {
      el.style.background = '#fef2f2';
      el.style.color = '#991b1b';
      el.style.border = '1px solid #fecaca';
    }
    el.innerHTML = msg;
  }

  // Bind all demo CTAs
  function bindCtAs() {
    document.querySelectorAll('[data-demo-modal]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { injectModal(); bindCtAs(); });
  } else {
    injectModal();
    bindCtAs();
  }

  // Expose global para CTAs inline (legacy)
  window.savvyOpenModal = openModal;
})();
