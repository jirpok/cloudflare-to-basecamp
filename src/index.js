import PostalMime from "postal-mime";

export default {
  async email(message, env, ctx) {
    const basecampUrl = `https://3.basecamp.com/{account_id}/integrations/{chatbot_key}/buckets/{project_id}/chats/{chat_id}/lines
    `;

    const email = await PostalMime.parse(message.raw);
    const fromName = email.from?.name || null;

    let fromAddress = email.from?.address;
    fromAddress = fromName ? ` (${fromAddress})` : fromAddress;
    const subject = email.subject || null;
    let body = email.html || email.text || null;

    // convert \n to <br>
    body = body.replace(/\n/g, "<br>");

    const payload = {
      content: `<div><strong>subject:</strong> ${subject}<br><strong>from:</strong> ${fromName ?? ""}${fromAddress}<br><br>${body}</div>`,
    };

    const response = await fetch(basecampUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async fetch(request) {
    return new Response("Worker running");
  },
};
