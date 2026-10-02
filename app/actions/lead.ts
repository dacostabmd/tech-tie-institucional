"use server";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Server Action de demonstracao: apenas simula o envio do formulario de contato.
// INTEGRACAO FUTURA: substituir o console.log abaixo por chamada real a um
// CRM/servico de automacao (ex.: HubSpot, RD Station, webhook proprio) e
// adicionar validacao/sanitizacao robusta dos campos antes de enviar.
// Campos opcionais (oab, whatsapp, cnj, origem) sao enviados apenas por
// algumas variantes da landing page.
export async function submitLeadForm(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const oab = formData.get("oab")?.toString().trim();
  const whatsapp = formData.get("whatsapp")?.toString().trim();
  const cnj = formData.get("cnj")?.toString().trim();
  const origem = formData.get("origem")?.toString().trim();

  if (!name || !email) {
    return { status: "error", message: "Preencha nome e e-mail para continuar." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Informe um e-mail válido." };
  }

  console.log("[TechTie] Novo lead recebido (simulado):", {
    name,
    email,
    oab,
    whatsapp,
    cnj,
    origem,
  });

  return {
    status: "success",
    message:
      "Recebemos seus dados. Nossa equipe entrará em contato em breve para apresentar o CRM jurídico da TechTie.",
  };
}
