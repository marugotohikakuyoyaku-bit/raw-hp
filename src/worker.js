import { EmailMessage } from "cloudflare:email";
import { createMimeMessage, Mailbox } from "mimetext";

const CONTACT_TO = "rawizuoshima@gmail.com";
const CONTACT_FROM = "contact@rawizuoshima.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_request" }, 400);
  }

  const name = String(data.name || "").trim().slice(0, 100);
  const email = String(data.email || "").trim().slice(0, 200);
  const message = String(data.message || "").trim().slice(0, 4000);

  if (!name || !email || !message) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }

  const msg = createMimeMessage();
  msg.setSender({ name: "籠 —RAW— お問い合わせフォーム", addr: CONTACT_FROM });
  msg.setRecipient(CONTACT_TO);
  msg.setHeader("Reply-To", new Mailbox(email));
  msg.setSubject(`【お問い合わせ】${name} 様より`);
  msg.addMessage({
    contentType: "text/plain",
    data: `お名前: ${name}\nメールアドレス: ${email}\n\n${message}`,
  });

  const email_ = new EmailMessage(CONTACT_FROM, CONTACT_TO, msg.asRaw());

  try {
    await env.SEB.send(email_);
  } catch (err) {
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
