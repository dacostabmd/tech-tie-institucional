"use server";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  reason?: "missing-fields" | "invalid-email";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Server Action de demonstracao: apenas simula o envio do formulario de contato.
// INTEGRACAO FUTURA: substituir o console.log abaixo por chamada real a um
// CRM/servico de automacao (ex.: HubSpot, RD Station, webhook proprio) e
// adicionar validacao/sanitizacao robusta dos campos antes de enviar.
// Campos opcionais (company, whatsapp, origem) sao enviados apenas por
// algumas variantes da landing page.
//
// O retorno carrega apenas um status/motivo (sem texto), para que a UI
// (lead-form.tsx) resolva a mensagem localizada via next-intl.
export async function submitLeadForm(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const company = formData.get("company")?.toString().trim();
  const whatsapp = formData.get("whatsapp")?.toString().trim();
  const origem = formData.get("origem")?.toString().trim();

  if (!name || !email) {
    return { status: "error", reason: "missing-fields" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", reason: "invalid-email" };
  }

  console.log("[TechTie] Novo lead recebido (simulado):", {
    name,
    email,
    company,
    whatsapp,
    origem,
  });

  return { status: "success" };
}
