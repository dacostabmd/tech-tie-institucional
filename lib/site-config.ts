// Dados centrais da landing page. Valores marcados como PLACEHOLDER devem
// ser substituidos por informacoes reais antes da publicacao.

export const siteConfig = {
  name: "TechTie",
  tagline: "Dashboards, CRM, automações e IA sob medida para o seu negócio",
  // PLACEHOLDER: numero de WhatsApp fictício, substituir pelo numero real da operacao comercial.
  whatsappNumber: "5500000000000",
  whatsappMessage: "Olá, gostaria de saber mais sobre a plataforma da TechTie.",
  // PLACEHOLDER: e-mail institucional fictício.
  contactEmail: "contato@techtie.com.br",
  // PLACEHOLDER: CNPJ fictício, substituir pelo CNPJ real antes de publicar.
  cnpj: "00.000.000/0001-00",
  // PLACEHOLDER: endereco fictício.
  address: "Endereco a definir - PLACEHOLDER",
};

export const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  siteConfig.whatsappMessage,
)}`;
