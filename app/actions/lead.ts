"use server";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  reason?: "missing-fields" | "invalid-email" | "invalid-document" | "server-error";
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanNumbers(val: string): string {
  return val.replace(/\D/g, "");
}

const DEFAULT_PARTICIPANTS = [
  { id: 1, name: "Bruno Durão" },
  { id: 178968, name: "Caio Marques" },
  { id: 8465, name: "Caio Araújo" },
  { id: 5305, name: "Gabriel Alves" },
  { id: 66366, name: "Henrique Gomes" },
] as const;

const PARTICIPANT_IDS = DEFAULT_PARTICIPANTS.map((p) => p.id);

/**
 * Server Action para envio do formulário de contato / lead da TechTie.
 * Conecta-se diretamente ao Bitrix24 via Webhook REST para criação de Card/Deal no Pipeline (Funil) configurado.
 */
export async function submitLeadForm(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const docType = (formData.get("docType")?.toString().trim() || "cnpj") as "cnpj" | "cpf";
  const document = formData.get("document")?.toString().trim() || "";
  const company = formData.get("company")?.toString().trim() || "";
  const segment = formData.get("segment")?.toString().trim() || "";
  const whatsapp = formData.get("whatsapp")?.toString().trim() || "";
  const origem = formData.get("origem")?.toString().trim() || "Landing Page TechTie";
  const utmSource = formData.get("utm_source")?.toString().trim() || "";
  const utmMedium = formData.get("utm_medium")?.toString().trim() || "";
  const utmCampaign = formData.get("utm_campaign")?.toString().trim() || "";
  const utmContent = formData.get("utm_content")?.toString().trim() || "";
  const utmTerm = formData.get("utm_term")?.toString().trim() || "";

  // Validação dos campos obrigatórios
  const rawPhone = cleanNumbers(whatsapp);
  if (!name || !email || !segment || !whatsapp || rawPhone.length < 10) {
    return { status: "error", reason: "missing-fields" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", reason: "invalid-email" };
  }

  const rawDoc = cleanNumbers(document);
  if (docType === "cnpj" && rawDoc.length > 0 && rawDoc.length !== 14) {
    return { status: "error", reason: "invalid-document" };
  }
  if (docType === "cpf" && rawDoc.length > 0 && rawDoc.length !== 11) {
    return { status: "error", reason: "invalid-document" };
  }

  // Configuração Bitrix24
  const webhookUrl =
    process.env.BITRIX_WEBHOOK_URL ||
    process.env.BITRIX24_WEBHOOK_URL;
  const pipelineId =
    process.env.BITRIX_PIPELINE_ID ||
    process.env.BITRIX24_PIPELINE_ID ||
    process.env.BITRIX24_CATEGORY_ID;
  const entityType = (process.env.BITRIX_ENTITY_TYPE || "deal").toLowerCase();

  const formattedDocType = docType === "cnpj" ? "Pessoa Jurídica (CNPJ)" : "Pessoa Física (CPF)";
  const title = `[TechTie] ${name}${company ? ` - ${company}` : ` (${segment})`}`;

  const participantsSummary = DEFAULT_PARTICIPANTS.map((p) => `${p.name} (ID: ${p.id})`).join(", ");

  const comments =
    `=== TECHTIE - SOLICITAÇÃO DE ESPECIALISTA ===\n` +
    `👤 Nome: ${name}\n` +
    `✉️ E-mail: ${email}\n` +
    `📱 WhatsApp/Telefone: ${whatsapp || "Não informado"}\n` +
    `🏷️ Tipo de Cadastro: ${formattedDocType}\n` +
    `📄 Documento (${docType.toUpperCase()}): ${document || "Não informado"}\n` +
    `🏢 Empresa: ${company || (docType === "cnpj" ? "Não informada" : "Pessoa Física / Autônomo")}\n` +
    `💼 Segmento de Atuação: ${segment}\n` +
    `👥 Participantes: ${participantsSummary}\n` +
    `🌐 Origem: ${origem}\n` +
    `📊 UTM: source=${utmSource || "-"} medium=${utmMedium || "-"} campaign=${utmCampaign || "-"} content=${utmContent || "-"} term=${utmTerm || "-"}\n` +
    `📅 Data/Hora: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`;

  if (webhookUrl) {
    try {
      const cleanUrl = webhookUrl.replace(/\/+$/, "");
      const isLead = entityType === "lead";
      const endpoint = cleanUrl.endsWith(".json")
        ? cleanUrl
        : `${cleanUrl}/${isLead ? "crm.lead.add.json" : "crm.deal.add.json"}`;

      const numericPipelineId =
        pipelineId !== undefined && pipelineId !== "" ? Number(pipelineId) : undefined;

      const payload = isLead
        ? {
            fields: {
              TITLE: title,
              NAME: name,
              EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
              PHONE: whatsapp ? [{ VALUE: whatsapp, VALUE_TYPE: "WORK" }] : [],
              COMPANY_TITLE: company || (docType === "cnpj" ? "Empresa a contatar" : ""),
              ASSIGNED_BY_ID: 1,
              OBSERVERS: PARTICIPANT_IDS,
              OBSERVER_IDS: PARTICIPANT_IDS,
              COMMENTS: comments,
              SOURCE_ID: "WEB",
              OPENED: "Y",
            },
          }
        : {
            fields: {
              TITLE: title,
              CATEGORY_ID: numericPipelineId !== undefined && !isNaN(numericPipelineId) ? numericPipelineId : 0,
              STAGE_ID: numericPipelineId ? `C${numericPipelineId}:NEW` : "NEW",
              ASSIGNED_BY_ID: 1,
              OBSERVERS: PARTICIPANT_IDS,
              OBSERVER_IDS: PARTICIPANT_IDS,
              COMMENTS: comments,
              SOURCE_ID: "WEB",
              OPENED: "Y",
              UTM_SOURCE: utmSource || undefined,
              UTM_MEDIUM: utmMedium || undefined,
              UTM_CAMPAIGN: utmCampaign || undefined,
              UTM_CONTENT: utmContent || undefined,
              UTM_TERM: utmTerm || undefined,
            },
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[TechTie Bitrix] Falha na API do Bitrix24:", res.status, errText);
        return { status: "error", reason: "server-error" };
      }

      const result = await res.json().catch(() => ({}));
      const createdId = result?.result;
      console.log(`[TechTie Bitrix] Card criado com sucesso no Bitrix24! ID:`, createdId);

      // Adiciona comentário na timeline notificando e marcando todos os participantes
      if (createdId) {
        const commentEndpoint = `${cleanUrl}/crm.timeline.comment.add.json`;
        const mentions = DEFAULT_PARTICIPANTS.map((p) => `[USER=${p.id}]${p.name}[/USER]`).join(", ");
        const commentPayload = {
          fields: {
            ENTITY_ID: createdId,
            ENTITY_TYPE: isLead ? "lead" : "deal",
            COMMENT:
              `${mentions}\n\n` +
              `🚀 Novo lead qualificado recebido via Landing Page TechTie!\n` +
              `👤 Nome: ${name}\n` +
              `📱 WhatsApp: ${whatsapp}\n` +
              `✉️ E-mail: ${email}\n` +
              `🏢 Empresa: ${company || (docType === "cnpj" ? "Não informada" : "Pessoa Física")}\n` +
              `💼 Segmento: ${segment}`,
          },
        };
        await fetch(commentEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentPayload),
        }).catch((e) => console.error("[TechTie Bitrix] Erro ao adicionar menções na timeline:", e));
      }

      return { status: "success" };
    } catch (err) {
      console.error("[TechTie Bitrix] Exceção na chamada ao CRM:", err);
      return { status: "error", reason: "server-error" };
    }
  }

  // Em ambiente local sem BITRIX_WEBHOOK_URL definido, registra no console para homologação
  console.log("[TechTie] Lead recebido (modo simulação/dev - adicione BITRIX_WEBHOOK_URL no .env.local para envio ao Bitrix):");
  console.log({
    name,
    email,
    docType,
    document,
    company,
    segment,
    whatsapp,
    origem,
    pipelineId: pipelineId || 0,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  });

  return { status: "success" };
}
