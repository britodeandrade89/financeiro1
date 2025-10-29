// @ts-nocheck
import { GoogleGenAI, Chat } from "@google/genai";

// =================================================================================
// ICONS & CATEGORIES
// =================================================================================
const ICONS = {
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    income: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5l-5-5-5 5M17 19l-5 5-5 5"></path></svg>`,
    expense: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5-5"></path></svg>`,
    fixed: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    variable: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
    shopping: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    aiAnalysis: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 8.3 9c.5 1.1 1.4 2 2.7 2s2.2-.9 2.7-2c.1-.4.2-.8.3-1.3.6-1.1 0-2.3-1-3.1-.3-.2-.6-.3-1-.3z"></path><path d="M12 21c-1.2 0-2.4-.6-3-1.7A3.6 3.6 0 0 1 8.3 15c.5-1.1 1.4-2 2.7-2s2.2.9 2.7 2c.1.4.2.8.3 1.3.6 1.1 0 2.3-1 3.1-.3-.2-.6-.3-1 .3z"></path><path d="M3 12c0-1.2.6-2.4 1.7-3A3.6 3.6 0 0 1 9 8.3c1.1.5 2 1.4 2 2.7s-.9 2.2-2 2.7c-.4.1-.8.2-1.3.3-1.1.6-2.3 0-3.1-1-.2-.3-.3-.6-.3-1z"></path><path d="M21 12c0-1.2-.6-2.4-1.7-3A3.6 3.6 0 0 0 15 8.3c-1.1.5-2 1.4-2 2.7s.9 2.2 2 2.7c.4.1.8.2 1.3.3 1.1.6 2.3 0 3.1-1 .2-.3.3-.6-.3-1z"></path></svg>`,
    lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.09 16.05a2.41 2.41 0 0 1-2.41-2.41V10a4.69 4.69 0 0 0-9.38 0v3.64a2.41 2.41 0 0 1-2.41 2.41"></path><path d="M8.5 16.05V18a1.5 1.5 0 0 0 3 0v-1.95"></path><path d="M15.09 16.05a2.41 2.41 0 0 0 2.41-2.41V10a4.69 4.69 0 0 1 9.38 0v3.64a2.41 2.41 0 0 0 2.41 2.41"></path><path d="M17.5 16.05V18a1.5 1.5 0 0 1-3 0v-1.95"></path></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    goal: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    investment: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4"></path><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"></path><path d="M12 12h.01"></path></svg>`
};

const SPENDING_CATEGORIES = {
    moradia: { name: 'Moradia', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>` },
    alimentacao: { name: 'Alimentação', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`},
    transporte: { name: 'Transporte', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v1"></path><path d="M14 9H4.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 0 0-5z"></path><path d="M5 15h14"></path><circle cx="7" cy="19" r="2"></circle><circle cx="17" cy="19" r="2"></circle></svg>` },
    saude: { name: 'Saúde', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L12 2A4.99 4.99 0 0 1 17 7L17 7A4.99 4.99 0 0 1 12 12L12 12A4.99 4.99 0 0 1 7 7L7 7A4.99 4.99 0 0 1 12 2z"></path><path d="M12 12L12 22"></path><path d="M17 7L22 7"></path><path d="M7 7L2 7"></path></svg>` },
    lazer: { name: 'Lazer', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>` },
    educacao: { name: 'Educação', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10v6M12 2v14M8 16L4 14M16 16l4-2M12 22a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z"></path></svg>` },
    dividas: { name: 'Dívidas', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` },
    pessoal: { name: 'Pessoal', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 16.5c-3.5 0-6.5 2-6.5 4.5h13c0-2.5-3-4.5-6.5-4.5z"></path><path d="M20.5 12c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5z"></path><path d="M3.5 12c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5z"></path></svg>` },
    investimento: { name: 'Investimentos', icon: ICONS.investment },
    shopping: { name: 'Compras', icon: ICONS.shopping },
    outros: { name: 'Outros', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>` },
};

// =================================================================================
// INITIAL DATA
// =================================================================================
const octoberData = {
    incomes: [
        { id: "inc1", description: 'SALARIO MARCELLY', amount: 3349.92, paid: true },
        { id: "inc2", description: 'SALARIO ANDRE', amount: 3349.92, paid: true },
        { id: "inc3", description: 'MUMBUCA MARCELLY', amount: 617.50, paid: true },
        { id: "inc4", description: 'MUMBUCA ANDRE', amount: 617.50, paid: true },
        { id: "inc5", description: 'FÉRIAS ANDRE', amount: 852.00, paid: true },
        { id: "inc6", description: 'FÉRIAS MARCELLY', amount: 852.00, paid: true },
    ],
    expenses: [
        { id: "exp1", description: "ABASTECIMENTO MENSAL (SEPARAR NO SOFISA)", amount: 500.00, current: 9, total: 12, type: "fixed", category: "transporte", paid: true, cyclic: true, dueDate: '2025-10-05', paidDate: '2025-10-01' },
        { id: "exp2", description: "ALUGUEL", amount: 1300.00, current: 9, total: 12, type: "fixed", category: "moradia", paid: true, cyclic: true, dueDate: '2025-10-10', paidDate: '2025-10-08' },
        { id: "exp3", description: "APPAI DA MARCELLY", amount: 110.00, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: false, dueDate: '2025-10-15', paidDate: '2025-10-14' },
        { id: "exp4", description: "APPAI DO ANDRÉ", amount: 123.55, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: false, dueDate: '2025-10-15', paidDate: '2025-10-14' },
        { id: "exp5", description: "CIDADANIA PORTUGUESA", amount: 140.00, current: 12, total: 36, type: "fixed", category: "dividas", paid: false, cyclic: false, dueDate: '2025-10-20' },
        { id: "exp6", description: "CONTA DA CLARO", amount: 55.00, current: 9, total: 12, type: "fixed", category: "moradia", paid: false, cyclic: true, dueDate: '2025-10-20' },
        { id: "exp7", description: "CONTA DA VIVO - ANDRÉ", amount: 35.00, current: 9, total: 12, type: "fixed", category: "moradia", paid: false, cyclic: true, dueDate: '2025-10-20' },
        { id: "exp8", description: "CONTA DA VIVO - MARCELLY", amount: 59.00, current: 9, total: 12, type: "fixed", category: "moradia", paid: false, cyclic: true, dueDate: '2025-10-20' },
        { id: "exp9", description: "EMPRÉSTIMO PARA ACABAR DE PASSAR ABRIL (MARCIA BRITO)", amount: 220.00, current: 5, total: 6, type: "fixed", category: "dividas", paid: false, cyclic: false, dueDate: '2025-10-25' },
        { id: "exp10", description: "INVESTIMENTO PARA VIAGEM DE FÉRIAS (BANCO INTER)", amount: 600.00, current: 1, total: 5, type: "fixed", category: "investimento", paid: true, cyclic: false, dueDate: '2025-10-05', paidDate: '2025-10-02' },
        { id: "exp11", description: "GYMPASS ANDRÉ", amount: 70.00, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: true, dueDate: '2025-10-12', paidDate: '2025-10-11' },
        { id: "exp12", description: "GYMPASS MARCELLY", amount: 70.00, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: true, dueDate: '2025-10-12', paidDate: '2025-10-11' },
        { id: "exp13", description: "INTERMÉDICA DO ANDRÉ", amount: 123.00, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: true, dueDate: '2025-10-15', paidDate: '2025-10-14' },
        { id: "exp14", description: "INTERNET DE CASA", amount: 120.00, current: 9, total: 12, type: "fixed", category: "moradia", paid: false, cyclic: true, dueDate: '2025-10-18' },
        { id: "exp15", description: "RENEGOCIAR O CARREFOUR (SEPARAR NO SOFISA)", amount: 500.00, current: 1, total: 12, type: "fixed", category: "dividas", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp16", description: "REMÉDIOS DO ANDRÉ (SEPARAR NO SOFISA)", amount: 400.00, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: false, dueDate: '2025-10-05', paidDate: '2025-10-01' },
        { id: "exp17", description: "PSICÓLOGA DA MARCELLY", amount: 280.00, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: false, dueDate: '2025-10-10', paidDate: '2025-10-09' },
        { id: "exp18", description: "SEGURO DO CARRO (SEPARAR NO SOFISA)", amount: 143.00, current: 9, total: 12, type: "fixed", category: "transporte", paid: false, cyclic: true, dueDate: '2025-10-22' },
        { id: "exp19", description: "CONDOMÍNIO", amount: 260.00, current: 9, total: 12, type: "fixed", category: "moradia", paid: true, cyclic: true, dueDate: '2025-10-10', paidDate: '2025-10-09' },
        { id: "exp20", description: "ESCOLA DO ANDRÉ", amount: 560.00, current: 9, total: 12, type: "fixed", category: "educacao", paid: true, cyclic: false, dueDate: '2025-10-10', paidDate: '2025-10-09' },
        { id: "exp21", description: "FACULDADE DA MARCELLY", amount: 250.00, current: 1, total: 6, type: "fixed", category: "educacao", paid: true, cyclic: false, dueDate: '2025-10-15', paidDate: '2025-10-14' },
        { id: "exp22", description: "LUZ", amount: 200.00, current: 9, total: 12, type: "fixed", category: "moradia", paid: false, cyclic: true, dueDate: '2025-10-25' },
        { id: "exp23", description: "PLANO ODONTOLÓGICO DO ANDRÉ", amount: 22.00, current: 9, total: 12, type: "fixed", category: "saude", paid: true, cyclic: true, dueDate: '2025-10-15', paidDate: '2025-10-14' },
        { id: "exp24", description: "PEÇAS DO CARRO - CONSERTO DE DEZEMBRO (MARCIA BRITO)", amount: 67.70, current: 9, total: 10, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp25", description: "EMPRÉSTIMO DA TIA CÉLIA", amount: 400.00, current: 7, total: 10, type: "variable", category: "dividas", paid: false, cyclic: false, dueDate: '2025-10-30' },
        { id: "exp26", description: "PARCELAMENTO CARTÃO DE MENOR LIMITE DA MARCELLY", amount: 67.79, current: 4, total: 4, type: "variable", category: "dividas", paid: true, cyclic: false, dueDate: '2025-10-15', paidDate: '2025-10-15' },
        { id: "exp27", description: "FATURA DO CARTÃO DO ANDRÉ", amount: 100.00, current: 9, total: 12, type: "variable", category: "outros", paid: false, cyclic: false, dueDate: '2025-10-20' },
        { id: "exp28", description: "MÃO DE OBRA DO DAVI (MARCIA BRITO)", amount: 108.33, current: 2, total: 3, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp29", description: "PEÇA DO CARRO (MARCIA BRITO)", amount: 45.00, current: 2, total: 3, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp30", description: "MOLDURA DA MULTIMÍDIA 7 (MARCIA BRITO)", amount: 138.50, current: 2, total: 2, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp31", description: "MÁQUINA DO VIDRO ELÉTRICO (MARCIA BRITO)", amount: 62.50, current: 2, total: 2, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp32", description: "MULTIMÍDIA DE 7 (MARCIA BRITO)", amount: 268.50, current: 2, total: 2, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp33", description: "CASE DO RELÓGIO (MARCIA BRITO)", amount: 13.50, current: 2, total: 2, type: "variable", category: "pessoal", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp34", description: "MINI JARRA (MARCIA BRITO)", amount: 12.50, current: 2, total: 2, type: "variable", category: "outros", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp35", description: "FATURA CARTÃO PAGBANK", amount: 1441.45, current: 1, total: 1, type: "variable", category: "outros", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp36", description: "PERFUME DA MARCELLY", amount: 67.99, current: 2, total: 2, type: "variable", category: "pessoal", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp37", description: "COMPRAS NAS LOJAS AMERICANAS", amount: 104.46, current: 2, total: 2, type: "variable", category: "outros", paid: false, cyclic: false, dueDate: '2025-10-28' },
        { id: "exp38", description: "MULTAS (MARCIA BRITO)", amount: 260.00, current: 1, total: 4, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-10-30' }
    ],
    shoppingItems: [],
    goals: [
        { id: "goal_1", category: "moradia", amount: 2200 },
        { id: "goal_2", category: "saude", amount: 1200 },
        { id: "goal_3", category: "transporte", amount: 1000 },
        { id: "goal_4", category: "dividas", amount: 1500 },
        { id: "goal_5", category: "investimento", amount: 600 },
    ],
    bankAccounts: [
        { id: "acc_1", name: "Conta Principal", balance: 1500.75 },
        { id: "acc_2", name: "Poupança", balance: 5000.00 },
    ]
};

// =================================================================================
// MOCK FIREBASE - Refatorado para simular listeners em tempo real (onSnapshot)
// =================================================================================
let authStateChangedCallback = null;

const mockUsers = {
    'marcelly': { 
        uid: 'family_shared_uid_123', // UID UNIFICADO
        displayName: 'Família Bispo Brito', 
        email: 'bispobrito@gmail.com'
    }
};

// Função para transmitir atualizações para o listener na aba atual e para outras abas.
const broadcastUpdate = (path, data) => {
    // 1. Dispara um evento customizado para a aba atual.
    const event = new CustomEvent('firestore-update', { detail: { path, data } });
    window.dispatchEvent(event);

    // 2. Usa o localStorage para notificar outras abas/janelas.
    localStorage.setItem('firestore-last-update', JSON.stringify({
        path,
        data,
        timestamp: Date.now() // Garante que o evento 'storage' dispare mesmo com dados idênticos
    }));
};


const mockFirebase = {
    auth: {
        onAuthStateChanged: (callback) => {
            authStateChangedCallback = callback;
            const user = JSON.parse(localStorage.getItem('currentUser'));
            callback(user);
        },
        signInWithPopup: () => new Promise((resolve, reject) => {
            const modal = document.getElementById('googleSignInModal');
            const closeBtn = document.getElementById('closeGoogleSignInModalBtn');
            const accountsList = document.getElementById('googleAccountsList');
            
            const cleanup = () => {
                modal.classList.remove('active');
                closeBtn.removeEventListener('click', closeAndReject);
                accountsList.removeEventListener('click', handleAccountClick);
            };

            const closeAndReject = () => {
                cleanup();
                reject(new Error('Sign-in cancelled by user.'));
            };

            const handleAccountClick = (e) => {
                const accountEl = e.target.closest('.google-account-item');
                if (!accountEl) return;
                
                const userId = accountEl.dataset.userId;
                const selectedUser = mockUsers[userId];
                
                if (selectedUser) {
                    const user = {
                        uid: selectedUser.uid,
                        displayName: selectedUser.displayName,
                        email: selectedUser.email
                    };
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    if (authStateChangedCallback) {
                        authStateChangedCallback(user);
                    }
                    cleanup();
                    resolve({ user });
                }
            };
            
            accountsList.addEventListener('click', handleAccountClick);
            closeBtn.addEventListener('click', closeAndReject);
            
            modal.classList.add('active');
        }),
        signOut: () => new Promise(resolve => {
            localStorage.removeItem('currentUser');
            if (authStateChangedCallback) {
                authStateChangedCallback(null);
            }
            resolve();
        }),
    },
    firestore: {
        data: {}, // DECOUPLED INITIALIZATION: Step 1 - Initialize empty
        getDoc: (path) => new Promise(resolve => {
            const data = mockFirebase.firestore.data[path];
            resolve({
                exists: () => !!data,
                data: () => data,
            });
        }),
        setDoc: (path, data) => new Promise(resolve => {
            const deepCopiedData = JSON.parse(JSON.stringify(data));
            mockFirebase.firestore.data[path] = deepCopiedData;
            localStorage.setItem('firestoreMock', JSON.stringify(mockFirebase.firestore.data));
            // Transmite a alteração para todos os listeners ativos.
            broadcastUpdate(path, deepCopiedData);
            resolve();
        }),
        onSnapshot: (path, callback) => {
            // Handler que reage às atualizações transmitidas
            const handler = (event) => {
                if (event.detail.path === path) {
                    const snapshot = {
                        exists: () => !!event.detail.data,
                        data: () => event.detail.data,
                    };
                    callback(snapshot);
                }
            };
            window.addEventListener('firestore-update', handler);

            // Simula o comportamento do Firebase real, enviando os dados atuais imediatamente ao se inscrever.
            const initialData = mockFirebase.firestore.data[path];
            const initialSnapshot = {
                exists: () => !!initialData,
                data: () => initialData,
            };
            setTimeout(() => callback(initialSnapshot), 0);

            // Retorna uma função para cancelar a inscrição do listener.
            return () => {
                window.removeEventListener('firestore-update', handler);
            };
        }
    }
};

// DECOUPLED INITIALIZATION: Step 2 - Populate data after object creation
mockFirebase.firestore.data = JSON.parse(localStorage.getItem('firestoreMock')) || {
    // **DATA RESTORED**: Pre-seeding the data here ensures it's always available on a fresh start.
    'families/bispo-brito/months/2025-10': {
        data: octoberData
    }
};


// =================================================================================
// STATE & AI INSTANCE
// =================================================================================
const API_KEY = "AIzaSyAKesjiHKTQczXIbTzAmNd4sBDCXOp9BMQ";
const ai = new GoogleGenAI({ apiKey: API_KEY });
let chat: Chat | null = null;

let currentMonthData = { incomes: [], expenses: [], shoppingItems: [], goals: [], bankAccounts: [] };
let firestoreUnsubscribe = null; // Para gerenciar o listener em tempo real
let currentModalType = '';
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let deferredPrompt;
let currentUser = null;
const FAMILY_ID = 'bispo-brito'; // Explicit family ID for shared data

// =================================================================================
// DOM ELEMENTS
// =================================================================================
const elements = {
    monthDisplay: document.getElementById('monthDisplay'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    totalPending: document.getElementById('totalPending'),
    totalBalance: document.getElementById('totalBalance'),
    incomesList: document.getElementById('incomesList'),
    expensesList: document.getElementById('expensesList'),
    shoppingList: document.getElementById('shoppingList'),
    goalsList: document.getElementById('goalsList'),
    bankAccountsList: document.getElementById('bankAccountsList'),
    overviewChart: document.getElementById('overviewChart'),
    // Auth & Layout
    appContainer: document.getElementById('app-container'),
    loginScreen: document.getElementById('login-screen'),
    monthSelector: document.querySelector('.month-selector'),
    // Modals
    addModal: document.getElementById('addModal'),
    editModal: document.getElementById('editModal'),
    aiModal: document.getElementById('aiModal'),
    goalModal: document.getElementById('goalModal'),
    accountModal: document.getElementById('accountModal'),
    // Add Modal
    addModalTitle: document.getElementById('addModalTitle'),
    addForm: document.getElementById('addForm'),
    typeGroup: document.getElementById('typeGroup'),
    categoryGroup: document.getElementById('categoryGroup'),
    installmentsGroup: document.getElementById('installmentsGroup'),
    dueDateGroup: document.getElementById('dueDateGroup'),
    // Edit Modal
    editForm: document.getElementById('editForm'),
    editModalTitle: document.getElementById('editModalTitle'),
    editItemId: document.getElementById('editItemId'),
    editItemType: document.getElementById('editItemType'),
    editDescription: document.getElementById('editDescription'),
    editAmount: document.getElementById('editAmount'),
    editCategoryGroup: document.getElementById('editCategoryGroup'),
    editCategory: document.getElementById('editCategory'),
    editDueDate: document.getElementById('editDueDate'),
    editDueDateGroup: document.getElementById('editDueDateGroup'),
    editPaidDate: document.getElementById('editPaidDate'),
    editPaidDateGroup: document.getElementById('editPaidDateGroup'),
    editInstallmentsGroup: document.getElementById('editInstallmentsGroup'),
    editCurrentInstallment: document.getElementById('editCurrentInstallment'),
    editTotalInstallments: document.getElementById('editTotalInstallments'),
    editInstallmentsInfo: document.getElementById('editInstallmentsInfo'),
    // AI Modal
    aiAnalysis: document.getElementById('aiAnalysis'),
    aiModalTitle: document.getElementById('aiModalTitle'),
    aiChatForm: document.getElementById('aiChatForm'),
    aiChatInput: document.getElementById('aiChatInput'),
    // Goal Modal
    goalModalTitle: document.getElementById('goalModalTitle'),
    goalForm: document.getElementById('goalForm'),
    goalId: document.getElementById('goalId'),
    goalCategory: document.getElementById('goalCategory'),
    goalAmount: document.getElementById('goalAmount'),
    // Account Modal
    accountModalTitle: document.getElementById('accountModalTitle'),
    accountForm: document.getElementById('accountForm'),
    accountId: document.getElementById('accountId'),
    accountName: document.getElementById('accountName'),
    accountBalance: document.getElementById('accountBalance'),
    // Profile
    profileInfo: document.getElementById('profile-info'),
    // Tab & View Navigation
    tabBar: document.getElementById('tab-bar'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    appViews: document.querySelectorAll('.app-view'),
    segmentedBtns: document.querySelectorAll('.segmented-btn'),
};

// =================================================================================
// UTILS
// =================================================================================
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function parseCurrency(value) {
    if (typeof value !== 'string' || !value) return 0;
    const digits = value.replace(/\D/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10) / 100;
}

function getMonthName(month) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[month - 1];
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); // Ensure correct date parsing
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function simpleMarkdownToHtml(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\s*-\s/g, '<br>• ')
        .replace(/\n\s*\*\s/g, '<br>• ')
        .replace(/\n/g, '<br>');
}

function populateCategorySelects() {
    const selects = [
        document.getElementById('category'),
        document.getElementById('editCategory'),
        document.getElementById('goalCategory')
    ];
    selects.forEach(select => {
        if (select) {
            select.innerHTML = '';
            for (const key in SPENDING_CATEGORIES) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = SPENDING_CATEGORIES[key].name;
                select.appendChild(option);
            }
        }
    });
}


// =================================================================================
// DATABASE (IndexedDB for Offline & Firestore for Cloud Sync)
// =================================================================================
const idb = {
    db: null,
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('FinanceiroDB', 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains('months')) {
                    db.createObjectStore('months', { keyPath: 'id' });
                }
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            request.onerror = () => reject(request.error);
        });
    },
    async get(storeName, key) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    async set(storeName, value) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};

// =================================================================================
// DATA HANDLING
// =================================================================================
async function saveDataToFirestore(monthKey, data) {
    if (!currentUser) return;
    const docPath = `families/${FAMILY_ID}/months/${monthKey}`;
    try {
        await mockFirebase.firestore.setDoc(docPath, { data });
        console.log(`[Firestore] Data for ${monthKey} saved successfully.`);
    } catch (error) {
        console.error("[Firestore] Error saving data:", error);
    }
}

async function loadDataFromFirestore(path) {
    if (!currentUser) return null;
    try {
        const docSnap = await mockFirebase.firestore.getDoc(path);
        if (docSnap.exists()) {
            return docSnap.data().data;
        }
        return null;
    } catch (error) {
        console.error(`[Firestore] Error loading data from ${path}:`, error);
        return null;
    }
}

async function saveData() {
    if (!currentUser) return;
    console.log("Saving data immediately...");
    const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    
    // Create a deep copy to avoid mutation issues before saving
    const dataToSave = JSON.parse(JSON.stringify(currentMonthData));

    await idb.set('months', { id: monthKey, data: dataToSave });
    await saveDataToFirestore(monthKey, dataToSave);
    
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(sw => {
            sw.sync.register('sync-data');
        }).catch(err => console.error("Background sync registration failed:", err));
    }
}


async function loadData() {
    // Cancela a inscrição do listener do mês anterior para evitar múltiplas execuções.
    if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
        firestoreUnsubscribe = null;
    }

    if (!currentUser) {
        clearData();
        updateUI();
        return;
    }

    const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    const sharedPath = `families/${FAMILY_ID}/months/${monthKey}`;

    // Inscreve-se para receber atualizações em tempo real do documento do mês atual.
    firestoreUnsubscribe = mockFirebase.firestore.onSnapshot(sharedPath, async (docSnap) => {
        console.log("[Realtime] Received update for", sharedPath);
        if (docSnap.exists()) {
            const data = docSnap.data().data;
            // Compara os dados recebidos com os atuais para evitar re-renderizações desnecessárias.
            if (JSON.stringify(data) !== JSON.stringify(currentMonthData)) {
                console.log("[Realtime] Data changed. Updating UI.");
                currentMonthData = data;
                await idb.set('months', { id: monthKey, data: currentMonthData }); // Mantém o banco de dados local sincronizado
                updateUI();
                checkAndSendNotifications();
            }
        } else {
            console.log(`[Realtime] No data for ${monthKey}. Attempting to initialize.`);
            const localData = await idb.get('months', monthKey);
            if (localData) {
                currentMonthData = localData.data;
                 await saveData(); // Re-sync local data if Firestore is empty
            } else if (currentMonth === 10 && currentYear === 2025) {
                // This case handles loading the pre-seeded data for the first time
                console.log("[Data] Initializing with October sample data.");
                currentMonthData = JSON.parse(JSON.stringify(octoberData));
                await saveData();
            } else {
                await createNewMonthData();
            }
        }
    });

    updateMonthDisplay();
    requestNotificationPermission();
}


async function createNewMonthData() {
    console.log("[Data] Creating new month data...");
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const previousMonthKey = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
    const prevSharedPath = `families/${FAMILY_ID}/months/${previousMonthKey}`;

    let baseData = await loadDataFromFirestore(prevSharedPath);
    
    if (!baseData) {
        const previousSavedLocal = await idb.get('months', previousMonthKey);
        if(previousSavedLocal) {
            baseData = previousSavedLocal.data;
        } else if (prevMonth === 10 && prevYear === 2025) {
            baseData = octoberData;
        }
    }
    
    if (!baseData || typeof baseData !== 'object') {
        baseData = { incomes: [], expenses: [], shoppingItems: [], goals: [], bankAccounts: [] };
    }
    
    const newMonthData = {
        incomes: [],
        expenses: [],
        shoppingItems: [],
        goals: [],
        bankAccounts: JSON.parse(JSON.stringify(baseData.bankAccounts || []))
    };

    // 1. Generate new incomes with updated values
    newMonthData.incomes.push(
        { id: `inc_salario_marcelly_${Date.now()}`, description: 'SALARIO MARCELLY', amount: 3349.92, paid: false },
        { id: `inc_salario_andre_${Date.now()}`, description: 'SALARIO ANDRE', amount: 3349.92, paid: false },
        { id: `inc_mumbuca_marcelly_${Date.now()}`, description: 'MUMBUCA MARCELLY', amount: 650.00, paid: false },
        { id: `inc_mumbuca_andre_${Date.now()}`, description: 'MUMBUCA ANDRE', amount: 650.00, paid: false }
    );
    
    if (currentYear === 2025 && currentMonth === 12) {
        newMonthData.incomes.push(
            { id: `inc_13_marcelly_${Date.now()}`, description: 'SEGUNDA PARCELA 13º SALÁRIO MARCELLY', amount: 3349.92 / 2, paid: false },
            { id: `inc_13_andre_${Date.now()}`, description: 'SEGUNDA PARCELA 13º SALÁRIO ANDRÉ', amount: 3349.92 / 2, paid: false }
        );
    }

    // 2. Generate new goals based on Mumbuca and investments
    const totalMumbuca = 1300.00;
    newMonthData.goals.push(
        { id: `goal_shopping_${Date.now()}`, category: 'shopping', amount: totalMumbuca * 0.70 },
        { id: `goal_transporte_${Date.now()}`, category: 'transporte', amount: totalMumbuca * 0.30 }
    );

    const travelInvestment = (baseData.expenses || []).find(e => e.description.toUpperCase().includes('INVESTIMENTO PARA VIAGEM'));
    if (travelInvestment) {
        newMonthData.goals.push({ id: `goal_investimento_${Date.now()}`, category: 'investimento', amount: travelInvestment.amount });
    }
    
    const otherGoals = (baseData.goals || []).filter(g => 
        g.category !== 'shopping' && g.category !== 'transporte' && g.category !== 'investimento'
    );
    newMonthData.goals.push(...JSON.parse(JSON.stringify(otherGoals)));

    
    // 3. Carry over recurring and installment expenses
    (baseData.expenses || []).forEach(expense => {
        let shouldAdd = false;
        const newExpense = { ...expense, id: `exp_${Date.now()}_${Math.random()}`, paid: false, paidDate: null };
        
        if (expense.current < expense.total) {
            newExpense.current += 1;
            shouldAdd = true;
        } else if (expense.cyclic) {
            newExpense.current = 1;
            shouldAdd = true;
        }

        if(shouldAdd) {
            const newDate = new Date(newExpense.dueDate + 'T00:00:00');
            newDate.setMonth(newDate.getMonth() + 1);
            newExpense.dueDate = newDate.toISOString().split('T')[0];
            newMonthData.expenses.push(newExpense);
        }
    });

    // 4. Carry over unpaid shopping items
    (baseData.shoppingItems || [])
        .filter(item => !item.paid)
        .forEach(item => {
             newMonthData.shoppingItems.push({
                ...item,
                id: `shop_${Date.now()}_${Math.random()}`,
                paid: false,
                paidDate: null,
            });
        });

    currentMonthData = newMonthData;
    await saveData();
    updateUI();
}

function changeMonth(offset) {
    if (!currentUser) return;
    saveData(); 
    currentMonth += offset;
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    } else if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    loadData();
}

function clearData() {
    currentMonthData = { incomes: [], expenses: [], shoppingItems: [], goals: [], bankAccounts: [] };
}


// =================================================================================
// AUTHENTICATION
// =================================================================================
function handleLogin() {
    mockFirebase.auth.signInWithPopup()
        .catch(error => console.error("Login failed:", error));
}

function handleLogout() {
    mockFirebase.auth.signOut()
        .catch(error => console.error("Logout failed:", error));
}

function updateUIForAuthState(user) {
    currentUser = user;
    if (user) {
        renderProfilePage(user);
        elements.appContainer.classList.remove('hidden');
        elements.loginScreen.classList.add('hidden');
        document.getElementById('logout-button').addEventListener('click', handleLogout);
        
        if (!sessionStorage.getItem('has_loaded_once')) {
            const today = new Date();
            const dayOfMonth = today.getDate();
            let initialMonth = today.getMonth() + 1;
            let initialYear = today.getFullYear();

            // After day 25, automatically show the next month's plan.
            if (dayOfMonth > 25) {
                initialMonth++;
                if (initialMonth > 12) {
                    initialMonth = 1;
                    initialYear++;
                }
            }
            
            currentMonth = initialMonth;
            currentYear = initialYear;
            sessionStorage.setItem('has_loaded_once', 'true');
        }

        loadData();
        navigateTo('home');
    } else {
        elements.appContainer.classList.add('hidden');
        elements.loginScreen.classList.remove('hidden');
        sessionStorage.removeItem('has_loaded_once'); // Clear session state on logout
        clearData();
        updateUI();
    }
}

// =================================================================================
// NAVIGATION
// =================================================================================
function navigateTo(viewName) {
    // Update Views
    elements.appViews.forEach(view => {
        view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    // Update Tab Buttons
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    const showMonthSelector = ['home', 'lancamentos', 'metas'].includes(viewName);
    elements.monthSelector.style.display = showMonthSelector ? 'flex' : 'none';
}


// =================================================================================
// UI RENDERING
// =================================================================================
function updateUI() {
    updateSummary();
    renderList('incomes', elements.incomesList, createIncomeItem, "Nenhuma entrada registrada", ICONS.income);
    renderList('expenses', elements.expensesList, createExpenseItem, "Nenhuma despesa registrada", ICONS.expense, true);
    renderList('shoppingItems', elements.shoppingList, createShoppingItem, "Nenhuma compra registrada", ICONS.shopping);
    renderGoalsPage();
    renderBankAccounts();
    renderOverviewChart();
}

function updateSummary() {
    const totalIncome = currentMonthData.incomes.reduce((sum, item) => sum + item.amount, 0);
    const allExpenses = [...currentMonthData.expenses, ...currentMonthData.shoppingItems];
    const totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);
    const totalPending = allExpenses.filter(item => !item.paid).reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpenses;

    elements.totalIncome.textContent = formatCurrency(totalIncome);
    elements.totalExpenses.textContent = formatCurrency(totalExpenses);
    elements.totalPending.textContent = formatCurrency(totalPending);
    elements.totalBalance.textContent = formatCurrency(balance);
    elements.totalBalance.className = `summary-value ${balance >= 0 ? 'balance-positive' : 'balance-negative'}`;
}

function updateMonthDisplay() {
    elements.monthDisplay.textContent = `${getMonthName(currentMonth)} ${currentYear}`;
}

function renderList(type, listElement, itemCreator, emptyMessage, emptyIcon, groupByCat = false) {
    listElement.innerHTML = '';
    const items = currentMonthData[type] || [];

    if (items.length === 0) {
        listElement.innerHTML = `<div class="empty-state">${emptyIcon}<div>${emptyMessage}</div></div>`;
        return;
    }
    
    if (groupByCat) {
        const fixed = items.filter(i => i.type === 'fixed');
        const variable = items.filter(i => i.type === 'variable');
        
        if (fixed.length > 0) {
            const header = document.createElement('div');
            header.className = 'item-header';
            header.innerHTML = `${ICONS.fixed} Despesas Fixas`;
            listElement.appendChild(header);
            fixed.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).forEach(item => listElement.appendChild(itemCreator(item)));
        }

        if (variable.length > 0) {
            const header = document.createElement('div');
            header.className = 'item-header';
            header.innerHTML = `${ICONS.variable} Despesas Variáveis`;
            listElement.appendChild(header);
            variable.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).forEach(item => listElement.appendChild(itemCreator(item)));
        }

    } else {
        items.forEach(item => listElement.appendChild(itemCreator(item)));
    }
}

function createIncomeItem(income) {
    const item = document.createElement('div');
    item.className = 'item';
    item.onclick = () => openEditModal(income.id, 'incomes');
    item.innerHTML = `
        <div class="item-content">
            <div class="item-details">
                <div class="item-description">${income.description}</div>
            </div>
        </div>
        <div class="item-actions">
            <span class="item-amount income-amount">${formatCurrency(income.amount)}</span>
            <button class="action-btn edit-btn" title="Editar">${ICONS.edit}</button>
            <button class="action-btn delete-btn" title="Excluir">${ICONS.delete}</button>
        </div>
    `;
    item.querySelector('.delete-btn').onclick = (e) => { e.stopPropagation(); deleteItem(income.id, 'incomes'); };
    return item;
}

function createExpenseItem(expense) {
    const item = document.createElement('div');
    const isFinal = expense.current === expense.total;
    const isOverdue = expense.dueDate && !expense.paid && new Date(expense.dueDate) < new Date();
    
    let dateInfo = '';
    if (expense.paid && expense.paidDate) {
        dateInfo = `<span class="item-paid-date">${ICONS.check} Pago em ${formatDate(expense.paidDate)}</span>`;
    } else if (expense.dueDate) {
        dateInfo = `<span class="item-due-date ${isOverdue ? 'overdue' : ''}">${ICONS.calendar} ${formatDate(expense.dueDate)}</span>`;
    }

    item.className = 'item';
    item.onclick = () => openEditModal(expense.id, 'expenses');
    item.innerHTML = `
        <div class="item-content">
            <button class="check-btn ${expense.paid ? 'paid' : ''}" title="${expense.paid ? 'Marcar como pendente' : 'Marcar como pago'}">${ICONS.check}</button>
            <div class="item-details">
                <div class="item-description-wrapper">
                    ${expense.paid ? `<div class="paid-indicator" title="Pago">${ICONS.check}</div>` : ''}
                    <div class="item-description ${expense.paid ? 'paid' : ''}">${expense.description}</div>
                </div>
                <div class="item-meta">
                    <span class="item-type type-${expense.type}">${expense.type === 'fixed' ? 'Fixo' : 'Variável'}</span>
                    ${expense.total > 1 ? `<span class="item-installments ${isFinal ? 'final-installment' : ''}">${expense.current}/${expense.total}</span>` : ''}
                    ${dateInfo}
                </div>
            </div>
        </div>
        <div class="item-actions">
            <span class="item-amount expense-amount">${formatCurrency(expense.amount)}</span>
            <button class="action-btn edit-btn" title="Editar">${ICONS.edit}</button>
            <button class="action-btn delete-btn" title="Excluir">${ICONS.delete}</button>
        </div>
    `;
    item.querySelector('.check-btn').onclick = (e) => { e.stopPropagation(); togglePaid(expense.id, 'expenses'); };
    item.querySelector('.delete-btn').onclick = (e) => { e.stopPropagation(); deleteItem(expense.id, 'expenses'); };
    return item;
}

function createShoppingItem(itemData) {
    const item = document.createElement('div');
    const isOverdue = itemData.dueDate && !itemData.paid && new Date(itemData.dueDate) < new Date();

    let dateInfo = '';
    if (itemData.paid && itemData.paidDate) {
        dateInfo = `<span class="item-paid-date">${ICONS.check} Pago em ${formatDate(itemData.paidDate)}</span>`;
    } else if (itemData.dueDate) {
        dateInfo = `<span class="item-due-date ${isOverdue ? 'overdue' : ''}">${ICONS.calendar} ${formatDate(itemData.dueDate)}</span>`;
    }

    item.className = 'item';
    item.onclick = () => openEditModal(itemData.id, 'shoppingItems');
    item.innerHTML = `
        <div class="item-content">
            <button class="check-btn ${itemData.paid ? 'paid' : ''}" title="${itemData.paid ? 'Marcar como pendente' : 'Marcar como pago'}">${ICONS.check}</button>
            <div class="item-details">
                <div class="item-description-wrapper">
                    ${itemData.paid ? `<div class="paid-indicator" title="Pago">${ICONS.check}</div>` : ''}
                    <div class="item-description ${itemData.paid ? 'paid' : ''}">${itemData.description}</div>
                </div>
                 <div class="item-meta">
                    ${dateInfo}
                 </div>
            </div>
        </div>
        <div class="item-actions">
            <span class="item-amount expense-amount">${formatCurrency(itemData.amount)}</span>
            <button class="action-btn edit-btn" title="Editar">${ICONS.edit}</button>
            <button class="action-btn delete-btn" title="Excluir">${ICONS.delete}</button>
        </div>
    `;
    item.querySelector('.check-btn').onclick = (e) => { e.stopPropagation(); togglePaid(itemData.id, 'shoppingItems'); };
    item.querySelector('.delete-btn').onclick = (e) => { e.stopPropagation(); deleteItem(itemData.id, 'shoppingItems'); };
    return item;
}

function renderOverviewChart() {
    const allExpenses = [...(currentMonthData.expenses || []), ...(currentMonthData.shoppingItems || [])];
    const totalExpenses = allExpenses.reduce((s, e) => s + e.amount, 0);

    if (elements.overviewChart) {
        let overviewHTML = '';
        if (totalExpenses > 0) {
            overviewHTML += createPieChart();

            const marciaBritoDebt = allExpenses
                .filter(expense => expense.description.toUpperCase().includes('MARCIA BRITO'))
                .reduce((sum, expense) => sum + expense.amount, 0);
            
            if (marciaBritoDebt > 0) {
                overviewHTML += `
                    <div class="debt-summary">
                        <div class="debt-summary-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>Total a pagar para</span>
                        </div>
                        <div class="debt-summary-title">Marcia Brito</div>
                        <div class="debt-summary-amount">${formatCurrency(marciaBritoDebt)}</div>
                    </div>
                `;
            }
        } else {
            overviewHTML = `
                <div class="chart-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                    Sem dados de despesas para exibir o gráfico.
                </div>
            `;
        }
        elements.overviewChart.innerHTML = overviewHTML;
    }
}

function renderProfilePage(user) {
    if (!user) return;
    elements.profileInfo.innerHTML = `
        <div class="profile-name">${user.displayName}</div>
        <div class="profile-email">${user.email}</div>
    `;
}

// =================================================================================
// EVENT HANDLERS & ACTIONS
// =================================================================================
function togglePaid(id, type) {
    const items = currentMonthData[type] || [];
    const item = items.find(i => i.id === id);
    if (item) {
        item.paid = !item.paid;
        
        if (item.paid) {
            item.paidDate = new Date().toISOString().split('T')[0];
            const sent = JSON.parse(localStorage.getItem('sentNotifications') || '{}');
            delete sent[`upcoming-${id}`];
            delete sent[`overdue-${id}`];
            localStorage.setItem('sentNotifications', JSON.stringify(sent));
        } else {
            item.paidDate = null;
        }

        updateUI();
        saveData(); // Save immediately
    }
}

function deleteItem(id, type) {
    currentMonthData[type] = (currentMonthData[type] || []).filter(i => i.id !== id);

    const sent = JSON.parse(localStorage.getItem('sentNotifications') || '{}');
    delete sent[`upcoming-${id}`];
    delete sent[`overdue-${id}`];
    localStorage.setItem('sentNotifications', JSON.stringify(sent));

    updateUI();
    saveData(); // Save immediately
}

function handleAddItem(event) {
    event.preventDefault();
    const form = event.target;
    const description = form.description.value;
    const amount = parseCurrency(form.amount.value);
    const dueDate = form.dueDate.value;

    if (!description || isNaN(amount) || amount <= 0) return;
    
    const newItem = { id: `${currentModalType}_${Date.now()}`, description, amount, paid: false, dueDate, paidDate: null };
    
    if (currentModalType === 'income') {
        currentMonthData.incomes.push(newItem);
    } else if (currentModalType === 'expense') {
        newItem.type = form.type.value;
        newItem.category = form.category.value;
        newItem.current = parseInt(form.currentInstallment.value) || 1;
        newItem.total = parseInt(form.totalInstallments.value) || 1;
        newItem.cyclic = form.cyclic.checked;
        currentMonthData.expenses.push(newItem);
    } else if (currentModalType === 'shopping') {
        newItem.category = form.category.value;
        currentMonthData.shoppingItems.push(newItem);
    }
    
    updateUI();
    saveData(); // Save immediately
    closeAddModal();
}

function handleEditItem(event) {
    event.preventDefault();
    const id = elements.editItemId.value;
    const type = elements.editItemType.value;
    const item = (currentMonthData[type] || []).find(i => i.id === id);

    if (item) {
        item.description = elements.editDescription.value;
        item.amount = parseCurrency(elements.editAmount.value);
        
        if (item.dueDate !== undefined) item.dueDate = elements.editDueDate.value;
        if (item.paidDate !== undefined) item.paidDate = elements.editPaidDate.value || item.paidDate;
        if (item.category !== undefined) item.category = elements.editCategory.value;

        if (item.type === 'fixed' || item.type === 'variable') {
            item.current = parseInt(elements.editCurrentInstallment.value);
            item.total = parseInt(elements.editTotalInstallments.value);
        }
        updateUI();
        saveData();
        closeEditModal();
    }
}

// =================================================================================
// MODAL LOGIC
// =================================================================================
function openModal(modalElement) {
    modalElement.classList.add('active');
}
function closeModal(modalElement) {
    modalElement.classList.remove('active');
}

function openAddModal(type) {
    currentModalType = type;
    elements.addForm.reset();
    
    const titles = {
        income: 'Nova Entrada',
        expense: 'Nova Despesa',
        shopping: 'Nova Compra'
    };
    elements.addModalTitle.innerHTML = `${ICONS.add} ${titles[type]}`;
    
    const isExpense = type === 'expense';
    const isShopping = type === 'shopping';

    elements.typeGroup.style.display = isExpense ? 'block' : 'none';
    elements.categoryGroup.style.display = isExpense || isShopping ? 'block' : 'none';
    elements.dueDateGroup.style.display = type !== 'income' ? 'block' : 'none';
    elements.installmentsGroup.style.display = isExpense ? 'flex' : 'none';
    document.getElementById('cyclicGroup').style.display = isExpense ? 'flex' : 'none';

    openModal(elements.addModal);
}

function closeAddModal() {
    closeModal(elements.addModal);
}

function openEditModal(id, type) {
    const item = (currentMonthData[type] || []).find(i => i.id === id);
    if (!item) return;

    elements.editForm.reset();
    elements.editItemId.value = id;
    elements.editItemType.value = type;
    elements.editDescription.value = item.description;
    elements.editAmount.value = formatCurrency(item.amount);
    elements.editModalTitle.innerHTML = `${ICONS.edit} Editar Item`;
    
    const hasDueDate = type !== 'incomes';
    elements.editDueDateGroup.style.display = hasDueDate ? 'flex' : 'none';
    if(hasDueDate) elements.editDueDate.value = item.dueDate || '';

    const hasCategory = type === 'expenses' || type === 'shoppingItems';
    elements.editCategoryGroup.style.display = hasCategory ? 'block' : 'none';
    if (hasCategory) elements.editCategory.value = item.category;

    const canBePaid = type === 'expenses' || type === 'shoppingItems';
    elements.editPaidDateGroup.style.display = canBePaid && item.paid ? 'block' : 'none';
    if (canBePaid && item.paid) {
        elements.editPaidDate.value = item.paidDate || new Date().toISOString().split('T')[0];
    }

    const isExpense = type === 'expenses';
    elements.editInstallmentsGroup.style.display = isExpense ? 'flex' : 'none';
    elements.editInstallmentsInfo.style.display = isExpense ? 'flex' : 'none';
    if(isExpense) {
        elements.editCurrentInstallment.value = item.current;
        elements.editTotalInstallments.value = item.total;
    }

    openModal(elements.editModal);
}

function closeEditModal() {
    closeModal(elements.editModal);
}

// =================================================================================
// GOALS FEATURE
// =================================================================================
function renderGoalsPage() {
    const goals = currentMonthData.goals || [];
    elements.goalsList.innerHTML = '';

    if (goals.length === 0) {
        elements.goalsList.innerHTML = `<div class="empty-state">${ICONS.goal}<div>Você ainda não definiu nenhuma meta para este mês. Que tal começar agora?</div></div>`;
        return;
    }

    goals.forEach(goal => {
        let spent = 0;
        if (goal.category === 'shopping') {
            // Special case for 'shopping' goal, which sums up items from the shopping list
            spent = (currentMonthData.shoppingItems || []).reduce((sum, item) => sum + item.amount, 0);
        } else {
            // Standard goals are based on expense categories
            spent = (currentMonthData.expenses || [])
                .filter(e => e.category === goal.category)
                .reduce((sum, e) => sum + e.amount, 0);
        }

        const percentage = goal.amount > 0 ? (spent / goal.amount) * 100 : 0;
        const remaining = goal.amount - spent;

        let progressBarClass = 'safe';
        if (percentage > 100) progressBarClass = 'danger';
        else if (percentage > 75) progressBarClass = 'warning';

        const card = document.createElement('div');
        card.className = 'goal-card';
        card.innerHTML = `
            <div class="goal-card-header">
                <div class="goal-card-title">
                    ${SPENDING_CATEGORIES[goal.category]?.icon || ''}
                    <span>${SPENDING_CATEGORIES[goal.category]?.name || goal.category}</span>
                </div>
                <div class="goal-card-actions">
                     <button class="action-btn edit-goal-btn" title="Editar Meta">${ICONS.edit}</button>
                     <button class="action-btn delete-goal-btn" title="Excluir Meta">${ICONS.delete}</button>
                </div>
            </div>
            <div class="goal-card-body">
                <div class="goal-amounts">
                    <span class="goal-spent-amount">${formatCurrency(spent)}</span>
                    <span class="goal-total-amount">de ${formatCurrency(goal.amount)}</span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-bar-inner ${progressBarClass}" style="width: ${Math.min(percentage, 100)}%;"></div>
                </div>
                <div class="goal-remaining ${remaining < 0 ? 'over' : 'safe'}">
                    ${remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} acima`}
                </div>
            </div>
        `;
        card.querySelector('.edit-goal-btn').onclick = () => openGoalModal(goal.id);
        card.querySelector('.delete-goal-btn').onclick = () => deleteGoal(goal.id);
        elements.goalsList.appendChild(card);
    });
}

function openGoalModal(id = null) {
    elements.goalForm.reset();
    const existingGoal = id ? (currentMonthData.goals || []).find(g => g.id === id) : null;

    if (existingGoal) {
        elements.goalModalTitle.innerHTML = `${ICONS.edit} Editar Meta`;
        elements.goalId.value = existingGoal.id;
        elements.goalCategory.value = existingGoal.category;
        elements.goalAmount.value = formatCurrency(existingGoal.amount);
        elements.goalCategory.disabled = true; // Prevent changing category when editing
    } else {
        elements.goalModalTitle.innerHTML = `${ICONS.add} Nova Meta`;
        elements.goalId.value = '';
        elements.goalCategory.disabled = false;
    }
    openModal(elements.goalModal);
}

function closeGoalModal() {
    closeModal(elements.goalModal);
}

function handleSaveGoal(event) {
    event.preventDefault();
    const id = elements.goalId.value;
    const category = elements.goalCategory.value;
    const amount = parseCurrency(elements.goalAmount.value);

    if (!category || isNaN(amount) || amount <= 0) return;

    if (id) { // Editing existing goal
        const goal = (currentMonthData.goals || []).find(g => g.id === id);
        if (goal) goal.amount = amount;
    } else { // Adding new goal
        if (!currentMonthData.goals) currentMonthData.goals = [];
        // Prevent duplicate goals for the same category
        if (currentMonthData.goals.some(g => g.category === category)) {
            alert('Já existe uma meta para esta categoria.');
            return;
        }
        const newGoal = { id: `goal_${Date.now()}`, category, amount };
        currentMonthData.goals.push(newGoal);
    }
    updateUI();
    saveData();
    closeGoalModal();
}

function deleteGoal(id) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        currentMonthData.goals = (currentMonthData.goals || []).filter(g => g.id !== id);
        updateUI();
        saveData();
    }
}


// =================================================================================
// BANK ACCOUNTS FEATURE
// =================================================================================
function renderBankAccounts() {
    const accounts = currentMonthData.bankAccounts || [];
    const listEl = elements.bankAccountsList;
    listEl.innerHTML = '';

    if (accounts.length === 0) {
        listEl.innerHTML = `<div class="empty-state-small">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            <span>Adicione suas contas para ver os saldos.</span>
        </div>`;
        document.getElementById('accounts-total-container').style.display = 'none';
        return;
    }

    document.getElementById('accounts-total-container').style.display = 'flex';
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    document.getElementById('accounts-total-amount').textContent = formatCurrency(totalBalance);

    accounts.forEach(acc => {
        const item = document.createElement('div');
        item.className = 'account-item';
        item.onclick = () => openAccountModal(acc.id);
        item.innerHTML = `
            <div class="account-details">
                <div class="account-name">${acc.name}</div>
                <div class="account-balance">${formatCurrency(acc.balance)}</div>
            </div>
            <div class="account-actions">
                <button class="action-btn edit-btn" title="Editar Saldo">${ICONS.edit}</button>
                <button class="action-btn delete-btn" title="Excluir Conta">${ICONS.delete}</button>
            </div>
        `;
        item.querySelector('.delete-btn').onclick = (e) => { e.stopPropagation(); deleteAccount(acc.id); };
        listEl.appendChild(item);
    });
}

function openAccountModal(id = null) {
    elements.accountForm.reset();
    const existingAccount = id ? (currentMonthData.bankAccounts || []).find(a => a.id === id) : null;

    if (existingAccount) {
        elements.accountModalTitle.innerHTML = `${ICONS.edit} Editar Saldo da Conta`;
        elements.accountId.value = existingAccount.id;
        elements.accountName.value = existingAccount.name;
        elements.accountBalance.value = formatCurrency(existingAccount.balance);
    } else {
        elements.accountModalTitle.innerHTML = `${ICONS.add} Adicionar Conta Bancária`;
        elements.accountId.value = '';
    }
    openModal(elements.accountModal);
}

function closeAccountModal() {
    closeModal(elements.accountModal);
}

function handleSaveAccount(event) {
    event.preventDefault();
    const id = elements.accountId.value;
    const name = elements.accountName.value.trim();
    const balance = parseCurrency(elements.accountBalance.value);

    if (!name || isNaN(balance)) {
        alert('Por favor, preencha o nome da conta e um saldo válido.');
        return;
    }
    
    if (!currentMonthData.bankAccounts) currentMonthData.bankAccounts = [];

    if (id) { // Editing
        const account = currentMonthData.bankAccounts.find(a => a.id === id);
        if (account) {
            account.name = name;
            account.balance = balance;
        }
    } else { // Adding
        const newAccount = { id: `acc_${Date.now()}`, name, balance };
        currentMonthData.bankAccounts.push(newAccount);
    }

    updateUI();
    saveData();
    closeAccountModal();
}

function deleteAccount(id) {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
        currentMonthData.bankAccounts = (currentMonthData.bankAccounts || []).filter(a => a.id !== id);
        updateUI();
        saveData();
    }
}


// =================================================================================
// AI ANALYSIS & CHAT
// =================================================================================
async function initializeAndStartChat() {
    openModal(elements.aiModal);
    elements.aiModalTitle.innerHTML = `${ICONS.aiAnalysis} IA Financeira`;
    elements.aiAnalysis.innerHTML = `
        <div id="ai-loading-state" class="loading">
            <div class="spinner"></div>
            <div>Analisando seus dados e preparando a IA...</div>
        </div>
    `;

    elements.aiChatInput.disabled = true;
    document.getElementById('aiChatSendBtn').disabled = true;
    elements.aiChatInput.placeholder = "Inicializando IA...";
    elements.aiChatForm.removeEventListener('submit', handleAiChatSubmit);

    try {
        chat = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: "Você é a 'IA Financeira', uma assistente especialista em finanças pessoais, amigável e perspicaz. Seu objetivo é ajudar o usuário a entender suas finanças, identificar padrões de gastos e encontrar oportunidades de economia. Suas respostas DEVEM ser em Português do Brasil. Baseie TODAS as suas respostas estritamente nos dados financeiros fornecidos no contexto da conversa. INSTRUÇÃO ESPECIAL E OBRIGATÓRIA: Sempre que identificar despesas contendo 'Marcia Brito' na descrição, você DEVE somar todos os valores e tratá-los como uma única dívida consolidada ao responder. Forneça conselhos claros, concisos e práticos. Utilize Markdown simples para formatação (ex: `**negrito**` e listas com `-`). Nunca inclua blocos de código JSON em suas respostas, a menos que seja explicitamente solicitado.",
            },
        });

        const initialPrompt = `
        ## Dados Financeiros do Mês de ${getMonthName(currentMonth)}/${currentYear} (Formato JSON):
        ${JSON.stringify(currentMonthData, null, 2)}
        
        ## Tarefa
        A partir de agora, analise esses dados para responder às minhas perguntas.

        Olá! Como minha assistente financeira, por favor, apresente-se brevemente, confirme que você analisou meus dados do mês atual e me diga como pode me ajudar a entender minhas finanças.
        `;

        const responseStream = await chat.sendMessageStream({ message: initialPrompt });

        const aiMessageEl = document.createElement('div');
        aiMessageEl.className = `chat-message ai-message`;
        const aiBubbleEl = document.createElement('div');
        aiBubbleEl.className = 'message-bubble';
        aiMessageEl.appendChild(aiBubbleEl);
        
        let fullResponseText = '';
        let firstChunk = true;
        for await (const chunk of responseStream) {
            if (firstChunk) {
                const pieChartHTML = createPieChart();
                elements.aiAnalysis.innerHTML = pieChartHTML;
                elements.aiAnalysis.appendChild(aiMessageEl);
                firstChunk = false;
            }
            fullResponseText += chunk.text;
            aiBubbleEl.innerHTML = simpleMarkdownToHtml(fullResponseText);
            elements.aiAnalysis.scrollTop = elements.aiAnalysis.scrollHeight;
        }

        elements.aiChatInput.disabled = false;
        document.getElementById('aiChatSendBtn').disabled = false;
        elements.aiChatInput.placeholder = "Pergunte sobre suas finanças...";
        elements.aiChatInput.focus();

    } catch (error) {
        console.error("Error initializing AI Chat:", error);
        elements.aiAnalysis.innerHTML = '';
        appendChatMessage('ai', 'Ocorreu um erro ao inicializar a IA. Verifique sua conexão ou tente novamente mais tarde.');
        elements.aiChatInput.placeholder = "Erro ao conectar com a IA";
    }

    elements.aiChatForm.addEventListener('submit', handleAiChatSubmit);
}

async function openAiModal() {
    await initializeAndStartChat();
}

function closeAiModal() {
    closeModal(elements.aiModal);
    elements.aiChatForm.removeEventListener('submit', handleAiChatSubmit);
    chat = null; // Clean up chat session
}

async function handleAiChatSubmit(event) {
    event.preventDefault();
    if (!chat) {
        appendChatMessage('ai', 'A sessão com a IA não foi iniciada. Por favor, feche e abra a janela novamente.');
        return;
    }
    const userInput = elements.aiChatInput.value.trim();
    if (!userInput) return;

    const initialView = document.getElementById('chat-initial-view');
    if (initialView) initialView.remove();
    
    appendChatMessage('user', userInput);
    elements.aiChatInput.value = '';
    
    const sendButton = document.getElementById('aiChatSendBtn');
    elements.aiChatInput.disabled = true;
    sendButton.disabled = true;
    
    const aiMessageEl = document.createElement('div');
    aiMessageEl.className = `chat-message ai-message`;
    const aiBubbleEl = document.createElement('div');
    aiBubbleEl.className = 'message-bubble';
    aiMessageEl.appendChild(aiBubbleEl);
    elements.aiAnalysis.appendChild(aiMessageEl);

    aiBubbleEl.innerHTML = `
        <div class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    elements.aiAnalysis.scrollTop = elements.aiAnalysis.scrollHeight;

    try {
        const responseStream = await chat.sendMessageStream({ message: userInput });
        
        let fullResponseText = '';
        let firstChunk = true;

        for await (const chunk of responseStream) {
            if (firstChunk) {
                aiBubbleEl.innerHTML = ''; // Clear the typing indicator
                firstChunk = false;
            }
            fullResponseText += chunk.text;
            aiBubbleEl.innerHTML = simpleMarkdownToHtml(fullResponseText);
            elements.aiAnalysis.scrollTop = elements.aiAnalysis.scrollHeight;
        }
        
    } catch(error) {
        console.error("AI chat error:", error);
        aiBubbleEl.innerHTML = simpleMarkdownToHtml('**Erro:** Desculpe, não consegui processar sua solicitação no momento. Tente novamente.');
    } finally {
        elements.aiChatInput.disabled = false;
        sendButton.disabled = false;
        elements.aiChatInput.focus();
    }
}

function appendChatMessage(role, text) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${role}-message`;

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'message-bubble';
    
    bubbleEl.innerHTML = role === 'ai' ? simpleMarkdownToHtml(text) : text;
    
    messageEl.appendChild(bubbleEl);
    elements.aiAnalysis.appendChild(messageEl);

    // Scroll to bottom
    elements.aiAnalysis.scrollTop = elements.aiAnalysis.scrollHeight;
}

function createPieChart() {
    const allExpenses = [...(currentMonthData.expenses || []), ...(currentMonthData.shoppingItems || [])];
    const total = allExpenses.reduce((s, e) => s + e.amount, 0);

    if (total === 0) return '';
    
    const categoryTotals = {};
    allExpenses.forEach(exp => {
        const catName = SPENDING_CATEGORIES[exp.category]?.name || 'Outros';
        if (!categoryTotals[catName]) {
            categoryTotals[catName] = 0;
        }
        categoryTotals[catName] += exp.amount;
    });

    const colors = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    let colorIndex = 0;

    const categories = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        color: colors[colorIndex++ % colors.length]
    })).sort((a,b) => b.value - a.value);

    let cumulativePercent = 0;
    const paths = categories.map(cat => {
        const percent = cat.value / total;
        const startAngle = cumulativePercent * 360;
        const endAngle = (cumulativePercent + percent) * 360;
        cumulativePercent += percent;
        
        const largeArcFlag = percent > 0.5 ? 1 : 0;
        const x1 = 50 + 45 * Math.cos(Math.PI * startAngle / 180);
        const y1 = 50 + 45 * Math.sin(Math.PI * startAngle / 180);
        const x2 = 50 + 45 * Math.cos(Math.PI * endAngle / 180);
        const y2 = 50 + 45 * Math.sin(Math.PI * endAngle / 180);

        return `<path d="M 50,50 L ${x1},${y1} A 45,45 0 ${largeArcFlag},1 ${x2},${y2} Z" fill="${cat.color}" />`;
    }).join('');
    
    const legend = categories.map(cat => `
        <div class="legend-item">
            <div class="legend-label"><div class="legend-color" style="background-color:${cat.color}"></div>${cat.name}</div>
            <div class="legend-value">${formatCurrency(cat.value)} <span class="legend-percentage">(${(cat.value / total * 100).toFixed(1)}%)</span></div>
        </div>
    `).join('');

    return `
        <div class="pie-chart-container">
            <svg viewBox="0 0 100 100" class="pie-chart">${paths}</svg>
            <div class="pie-chart-legend">${legend}</div>
        </div>`;
}

// =================================================================================
// NOTIFICATIONS & PWA
// =================================================================================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

function checkAndSendNotifications() {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingDate = new Date();
    upcomingDate.setDate(today.getDate() + 3);

    const allItems = [...(currentMonthData.expenses || []), ...(currentMonthData.shoppingItems || [])];
    const sentNotifications = JSON.parse(localStorage.getItem('sentNotifications') || '{}');

    allItems.forEach(item => {
        if (item.paid || !item.dueDate) return;
        
        const dueDate = new Date(item.dueDate + 'T00:00:00');
        const isOverdue = dueDate < today;
        const isUpcoming = dueDate >= today && dueDate <= upcomingDate;

        if (isUpcoming && !sentNotifications[`upcoming-${item.id}`]) {
            new Notification('Lembrete de Vencimento', {
                body: `${item.description} vence em ${formatDate(item.dueDate)}. Valor: ${formatCurrency(item.amount)}`,
                icon: 'icon.svg'
            });
            sentNotifications[`upcoming-${item.id}`] = true;
        } else if (isOverdue && !sentNotifications[`overdue-${item.id}`]) {
            new Notification('Conta Vencida!', {
                body: `${item.description} está vencida desde ${formatDate(item.dueDate)}. Valor: ${formatCurrency(item.amount)}`,
                icon: 'icon.svg'
            });
            sentNotifications[`overdue-${item.id}`] = true;
        }
    });

    localStorage.setItem('sentNotifications', JSON.stringify(sentNotifications));
}


// =================================================================================
// INITIALIZATION
// =================================================================================
document.addEventListener('DOMContentLoaded', async () => {
    populateCategorySelects();
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('Service Worker registered.', reg))
                .catch(err => console.log('Service Worker registration failed: ', err));
        });
    }

    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBanner = document.getElementById('pwa-install-banner');
        if(installBanner) installBanner.classList.add('visible');
    });

    document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
        const installBanner = document.getElementById('pwa-install-banner');
        if (installBanner) installBanner.classList.remove('visible');
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                deferredPrompt = null;
            });
        }
    });

    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
        const installBanner = document.getElementById('pwa-install-banner');
        if (installBanner) installBanner.classList.remove('visible');
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        const installBanner = document.getElementById('pwa-install-banner');
        if (installBanner) installBanner.classList.remove('visible');
    });
    
    // Auto-format currency inputs
    const amountInputs = [
        document.getElementById('amount'), 
        document.getElementById('editAmount'),
        document.getElementById('goalAmount'),
        document.getElementById('accountBalance')
    ];
    amountInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                const target = e.target;
                let value = target.value.replace(/\D/g, '');
                
                if (value) {
                    const numberValue = parseInt(value, 10) / 100;
                    target.value = new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                    }).format(numberValue);
                } else {
                    target.value = '';
                }
            });
        }
    });


    // Attach Event Listeners
    document.getElementById('prevMonthBtn').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonthBtn').addEventListener('click', () => changeMonth(1));
    document.getElementById('openAiModalBtn').addEventListener('click', openAiModal);
    document.getElementById('openAddIncomeModalBtn').addEventListener('click', () => openAddModal('income'));
    document.getElementById('openAddExpenseModalBtn').addEventListener('click', () => openAddModal('expense'));
    document.getElementById('openAddShoppingModalBtn').addEventListener('click', () => openAddModal('shopping'));
    document.getElementById('openAddGoalModalBtn').addEventListener('click', () => openGoalModal());
    document.getElementById('openAddAccountModalBtn').addEventListener('click', () => openAccountModal());

    // Tab Navigation
    elements.tabBar.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn');
        if (tabBtn) {
            navigateTo(tabBtn.dataset.view);
        }
    });

    // Segmented Control for Lancamentos
    elements.segmentedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.segmentedBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const listId = btn.dataset.list;
            document.getElementById('incomesList').style.display = listId === 'incomesList' ? 'block' : 'none';
            document.getElementById('expensesList').style.display = listId === 'expensesList' ? 'block' : 'none';
            document.getElementById('shoppingList').style.display = listId === 'shoppingList' ? 'block' : 'none';
            
            document.getElementById('openAddIncomeModalBtn').style.display = listId === 'incomesList' ? 'flex' : 'none';
            document.getElementById('openAddExpenseModalBtn').style.display = listId === 'expensesList' ? 'flex' : 'none';
            document.getElementById('openAddShoppingModalBtn').style.display = listId === 'shoppingList' ? 'flex' : 'none';
        });
    });


    // Modal close/cancel listeners
    document.getElementById('closeAddModalBtn').addEventListener('click', closeAddModal);
    document.getElementById('cancelAddBtn').addEventListener('click', closeAddModal);
    document.getElementById('closeEditModalBtn').addEventListener('click', closeEditModal);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
    document.getElementById('closeAiModalBtn').addEventListener('click', closeAiModal);
    document.getElementById('closeGoalModalBtn').addEventListener('click', closeGoalModal);
    document.getElementById('cancelGoalBtn').addEventListener('click', closeGoalModal);
    document.getElementById('closeAccountModalBtn').addEventListener('click', closeAccountModal);
    document.getElementById('cancelAccountBtn').addEventListener('click', closeAccountModal);

    // Form submission listeners
    elements.addForm.addEventListener('submit', handleAddItem);
    elements.editForm.addEventListener('submit', handleEditItem);
    elements.goalForm.addEventListener('submit', handleSaveGoal);
    elements.accountForm.addEventListener('submit', handleSaveAccount);

    // Dynamic form logic
    document.getElementById('type').addEventListener('change', (e) => {
        const isFixed = e.target.value === 'fixed';
        document.getElementById('cyclicGroup').style.display = isFixed ? 'flex' : 'none';
        document.getElementById('installmentsGroup').style.display = isFixed ? 'flex' : 'none';
    });
    
    // Listener para sincronização entre abas
    window.addEventListener('storage', (event) => {
        if (event.key === 'firestore-last-update') {
            try {
                const { path, data } = JSON.parse(event.newValue);
                // Atualiza o cache de dados em memória do mock
                mockFirebase.firestore.data[path] = data;
                // Dispara o evento customizado para que o listener onSnapshot desta aba seja acionado
                const customEvent = new CustomEvent('firestore-update', { detail: { path, data } });
                window.dispatchEvent(customEvent);
                console.log(`[Realtime] Sincronizada atualização de outra aba para: ${path}`);
            } catch (e) {
                console.error("Erro ao processar evento de storage:", e);
            }
        }
    });

    // Attach login button listener reliably on page load
    document.getElementById('login-button-prompt').addEventListener('click', handleLogin);

    // Auth State Listener
    mockFirebase.auth.onAuthStateChanged(updateUIForAuthState);
});