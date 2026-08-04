from __future__ import annotations

import html
import re
from pathlib import Path

from .models import AuditFinding, WebsiteAuditInput, WebsiteAuditReport


def _tokens(text: str) -> set[str]:
    return set(re.findall(r"[a-zA-ZäöüÄÖÜß0-9-]+", text.lower()))


def audit_website(data: WebsiteAuditInput) -> WebsiteAuditReport:
    text = re.sub(r"\s+", " ", data.website_text).strip()
    lower = text.lower()
    tokens = _tokens(text)
    offer_terms = [x for x in _tokens(data.primary_offer) if len(x) > 3]
    audience_terms = [x for x in _tokens(data.desired_customer) if len(x) > 3]

    offer_found = any(term in lower for term in offer_terms)
    audience_found = any(term in lower for term in audience_terms)
    cta_found = bool(tokens & {"anfragen", "kontakt", "termin", "angebot", "buchen", "jetzt", "starten"})
    trust_found = bool(tokens & {"bewertungen", "referenzen", "kunden", "erfahrung", "zertifiziert", "meister", "garantie"})
    contact_found = any(term in lower for term in ("telefon", "e-mail", "email", "formular", "kontakt"))

    clarity = 20 + 35 * int(offer_found) + 25 * int(audience_found) + 20 * int(len(tokens) >= 50)
    trust = 25 + 45 * int(trust_found) + 30 * int(bool(re.search(r"\b\d+[+%]?\b", text)))
    action = 20 + 45 * int(cta_found) + 35 * int(contact_found)
    overall = round(clarity * 0.45 + trust * 0.20 + action * 0.35)

    findings: list[AuditFinding] = []
    if not offer_found:
        findings.append(AuditFinding(priority="critical", area="Angebot", issue="Das Hauptangebot ist nicht sofort erkennbar.", recommendation="Angebot in Überschrift und Einstieg konkret benennen."))
    if not audience_found:
        findings.append(AuditFinding(priority="high", area="Zielgruppe", issue="Die gewünschte Kundengruppe wird nicht direkt angesprochen.", recommendation="Zielgruppe im sichtbaren Einstiegsbereich nennen."))
    if not cta_found:
        findings.append(AuditFinding(priority="critical", area="Handlungsaufforderung", issue="Eine klare nächste Aktion fehlt.", recommendation=f"Eine sichtbare Schaltfläche mit „{data.desired_action}“ ergänzen."))
    if not trust_found:
        findings.append(AuditFinding(priority="medium", area="Vertrauen", issue="Konkrete Vertrauenssignale sind schwach oder fehlen.", recommendation="Nachprüfbare Referenzen, Erfahrung oder Kundenstimmen ergänzen."))
    if not contact_found:
        findings.append(AuditFinding(priority="high", area="Kontakt", issue="Der Kontaktweg ist nicht klar erkennbar.", recommendation="Telefon, E-Mail oder Formular sichtbar platzieren."))

    return WebsiteAuditReport(
        business_name=data.business_name,
        overall_score=min(100, overall),
        clarity_score=min(100, clarity),
        trust_score=min(100, trust),
        action_score=min(100, action),
        findings=findings,
        suggested_headline=f"{data.primary_offer} für {data.desired_customer}",
        suggested_cta=data.desired_action,
    )


def render_audit_html(report: WebsiteAuditReport) -> str:
    cards = "".join(
        f"<article><strong>{html.escape(f.priority.upper())} · {html.escape(f.area)}</strong><h3>{html.escape(f.issue)}</h3><p>{html.escape(f.recommendation)}</p></article>"
        for f in report.findings
    ) or "<article><h3>Keine kritischen Klarheitsprobleme erkannt.</h3></article>"
    return f"""<!doctype html><html lang='de'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width'><title>Website-Audit · {html.escape(report.business_name)}</title><style>body{{font-family:system-ui;max-width:900px;margin:auto;padding:32px;line-height:1.5;background:#f5f5f7;color:#171717}}header,article{{background:white;padding:24px;border-radius:18px;margin:16px 0}}.score{{font-size:64px;font-weight:800}}code{{background:#eee;padding:3px 7px;border-radius:6px}}</style></head><body><header><p>AION Revenue Engine</p><h1>Website-Audit für {html.escape(report.business_name)}</h1><div class='score'>{report.overall_score}/100</div><p>Klarheit {report.clarity_score} · Vertrauen {report.trust_score} · Aktion {report.action_score}</p></header>{cards}<article><h2>Empfohlener Einstieg</h2><h3>{html.escape(report.suggested_headline)}</h3><p>CTA: <code>{html.escape(report.suggested_cta)}</code></p></article></body></html>"""


def write_audit(report: WebsiteAuditReport, path: str | Path) -> Path:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(render_audit_html(report), encoding="utf-8")
    return target
