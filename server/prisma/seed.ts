import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const statuses = ['Concluída', 'Em Análise', 'Aguardando Assinatura', 'Registrada', 'Aguardando Laudo IML']
const bpms = ['18º BPM', 'RONDESP', '1º BPM', 'CIPE Leste', 'BPRv', '12º BPM', '6º BPM', '9º BPM', '40º BPM', 'CIPE Atlântico']
const locais = [
  { bairro: 'Periperi', municipio: 'Salvador' },
  { bairro: 'Bonfim', municipio: 'Salvador' },
  { bairro: 'São Caetano', municipio: 'Salvador' },
  { bairro: 'Itapuã', municipio: 'Salvador' },
  { bairro: 'Sussuarana', municipio: 'Salvador' },
  { bairro: 'Cajazeiras', municipio: 'Salvador' },
  { bairro: 'Tancredo Neves', municipio: 'Salvador' },
  { bairro: 'Pelourinho', municipio: 'Salvador' },
  { bairro: 'Brotas', municipio: 'Salvador' },
  { bairro: 'Campo Limpo', municipio: 'Feira de Santana' },
  { bairro: 'Monte Gordo', municipio: 'Camaçari' },
  { bairro: 'Vilas do Atlântico', municipio: 'Lauro de Freitas' },
  { bairro: 'Centro', municipio: 'Vitória da Conquista' },
  { bairro: 'Pontal', municipio: 'Ilhéus' },
  { bairro: 'Centro', municipio: 'Itabuna' },
  { bairro: 'Country Club', municipio: 'Juazeiro' },
]
const armas = [
  { tipo: 'Pistola', calibre: '9mm' },
  { tipo: 'Pistola', calibre: '.40 S&W' },
  { tipo: 'Revólver', calibre: '.38 SPL' },
  { tipo: 'Fuzil', calibre: '5.56mm' },
  { tipo: 'Pistola', calibre: '.380 ACP' },
]
const nomes = ['Pedro Aruana', 'Carlos Silva', 'Marcos Souza', 'Rafael Lima', 'Tiago Mendes', 'José Ferreira', 'André Costa', 'Luciano Barbosa', 'Felipe Santos', 'Roberto Alves', 'Sandro Pires', 'Diego Carvalho', 'Bruno Neto', 'Antônio Gomes', 'Paulo Rodrigues', 'Marcelo Dias', 'Fernando Reis']
const patentes = ['Sd', 'Cb', '3º Sgt', '2º Sgt', '1º Sgt', '2º Ten']

const narrativas = [
  'Guarnição em patrulhamento de rotina avistou indivíduo em atitude suspeita. Ao ser abordado, reagiu efetuando disparos de arma de fogo em direção aos policiais, que revidaram em legítima defesa.',
  'Equipe em operação de combate ao tráfico foi surpreendida por disparos advindos de beco lateral. Em resposta à injusta agressão, os policiais revidaram.',
  'Durante abordagem a veículo suspeito, condutor sacou arma de fogo e efetuou disparos em direção à guarnição. Policiais revidaram em legítima defesa.',
  'Patrulha atendeu chamado de roubo em andamento. Ao chegar ao local, policiais foram recebidos a tiros pelos suspeitos. Em troca de tiros, um dos criminosos foi atingido fatalmente.',
  'Policiais realizavam patrulhamento quando avistaram grupo armado. Ao tentarem efetuar abordagem, foram recebidos a disparos. Reagiram em legítima defesa.',
]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function pad(n: number, l = 2) { return String(n).padStart(l, '0') }

// 4 ocorrências por mês de Jan a Jun = 24 ocorrências distribuídas + status variados
const dadosPorMes = [
  { mes: 1, count: 3 },
  { mes: 2, count: 4 },
  { mes: 3, count: 3 },
  { mes: 4, count: 5 },
  { mes: 5, count: 6 },
  { mes: 6, count: 8 },
]

const ocorrencias: any[] = []
let counter = 50

for (const { mes, count } of dadosPorMes) {
  for (let i = 0; i < count; i++) {
    counter++
    const dia = Math.floor(Math.random() * 27) + 1
    const arma = pick(armas)
    const status = pick(statuses)
    const local = pick(locais)
    const numPoliciais = Math.floor(Math.random() * 2) + 2
    const policiais = Array.from({ length: numPoliciais }, () => ({
      nome: pick(nomes),
      patente: pick(patentes),
      matricula: String(Math.floor(Math.random() * 900000) + 100000),
      bpm: pick(bpms),
    }))

    const oc: any = {
      protocolo: `AR-2026/${pad(counter, 4)}`,
      dataFato: `2026-${pad(mes)}-${pad(dia)}`,
      horaFato: `${pad(Math.floor(Math.random() * 24))}:${pad(Math.floor(Math.random() * 60))}`,
      bpm: policiais[0].bpm,
      municipio: local.municipio,
      bairro: local.bairro,
      logradouro: `Rua ${pick(['das Flores', 'do Comércio', 'Nova', 'Central', 'da Paz'])}, ${Math.floor(Math.random() * 900) + 50}`,
      narrativa: pick(narrativas),
      vitimasFatais: Math.random() > 0.2 ? 1 : 0,
      feridos: Math.floor(Math.random() * 3),
      status,
      tipoArma: arma.tipo,
      calibre: arma.calibre,
      disparos: Math.floor(Math.random() * 8) + 1,
      armaApreendida: Math.random() > 0.3,
      policiais,
    }
    if (status === 'Concluída') {
      oc.assinadoPor = policiais[0].matricula
      oc.assinadoEm = new Date(`2026-${pad(mes)}-${pad(dia)}T10:00:00`)
    }
    ocorrencias.push(oc)
  }
}

async function main() {
  await prisma.ocorrencia.deleteMany()
  await prisma.ocorrencia.createMany({ data: ocorrencias })
  console.log(`Seed concluído — ${ocorrencias.length} ocorrências inseridas.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
