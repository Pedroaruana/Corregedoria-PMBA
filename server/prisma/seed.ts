import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.ocorrencia.deleteMany()

  await prisma.ocorrencia.createMany({
    data: [
      {
        protocolo: 'AR-2026/0342',
        dataFato: '2026-03-14',
        horaFato: '23:47',
        bpm: '18º BPM',
        municipio: 'Salvador',
        bairro: 'Periperi',
        logradouro: 'Rua das Flores, 120',
        narrativa:
          'Guarnição em patrulhamento de rotina avistou indivíduo em atitude suspeita. Ao ser abordado, reagiu efetuando disparos de arma de fogo em direção aos policiais, que revidaram em legítima defesa.',
        vitimasFatais: 1,
        feridos: 0,
        status: 'Concluída',
        tipoArma: 'Pistola',
        calibre: '9mm',
        disparos: 3,
        armaApreendida: true,
        policiais: [
          { nome: 'Pedro Aruana', patente: 'Sd', matricula: '123456', bpm: '18º BPM' },
          { nome: 'Carlos Silva', patente: 'Cb', matricula: '234567', bpm: '18º BPM' },
        ],
        assinadoPor: '123456',
        assinadoEm: new Date('2026-03-15T10:22:00'),
      },
      {
        protocolo: 'AR-2026/0289',
        dataFato: '2026-02-28',
        horaFato: '02:15',
        bpm: 'RONDESP',
        municipio: 'Feira de Santana',
        bairro: 'Campo Limpo',
        logradouro: 'Av. Presidente Dutra, 870',
        narrativa:
          'Equipe do RONDESP em operação de combate ao tráfico foi surpreendida por disparos advindos de beco lateral. Em resposta à injusta agressão, os policiais revidaram. Vítima encontrada com pistola calibre .40.',
        vitimasFatais: 1,
        feridos: 1,
        status: 'Aguardando Laudo IML',
        tipoArma: 'Pistola',
        calibre: '.40 S&W',
        disparos: 5,
        armaApreendida: true,
        policiais: [
          { nome: 'Marcos Souza', patente: '3º Sgt', matricula: '345678', bpm: 'RONDESP' },
          { nome: 'Rafael Lima', patente: 'Sd', matricula: '456789', bpm: 'RONDESP' },
          { nome: 'Tiago Mendes', patente: 'Cb', matricula: '567890', bpm: 'RONDESP' },
        ],
      },
      {
        protocolo: 'AR-2026/0201',
        dataFato: '2026-02-10',
        horaFato: '18:30',
        bpm: '1º BPM',
        municipio: 'Salvador',
        bairro: 'Bonfim',
        logradouro: 'Ladeira do Bonfim, 45',
        narrativa:
          'Durante abordagem a veículo suspeito, condutor sacou arma de fogo e efetuou disparos em direção à guarnição. Policiais revidaram em legítima defesa. Condutor veio a óbito no local.',
        vitimasFatais: 1,
        feridos: 0,
        status: 'Aguardando Assinatura',
        tipoArma: 'Revólver',
        calibre: '.38 SPL',
        disparos: 2,
        armaApreendida: false,
        policiais: [
          { nome: 'José Ferreira', patente: '2º Sgt', matricula: '678901', bpm: '1º BPM' },
          { nome: 'André Costa', patente: 'Sd', matricula: '789012', bpm: '1º BPM' },
        ],
      },
      {
        protocolo: 'AR-2026/0178',
        dataFato: '2026-01-29',
        horaFato: '21:05',
        bpm: 'CIPE Leste',
        municipio: 'Camaçari',
        bairro: 'Monte Gordo',
        logradouro: 'Rua B, Loteamento Monte Gordo',
        narrativa:
          'Guarnição da CIPE realizava varredura em área de conflito territorial entre facções criminosas quando foi alvejada a tiros. Após confronto, indivíduo foi atingido e socorrido, porém não resistiu.',
        vitimasFatais: 1,
        feridos: 0,
        status: 'Em Análise',
        tipoArma: 'Fuzil',
        calibre: '5.56mm',
        disparos: 8,
        armaApreendida: true,
        policiais: [
          { nome: 'Luciano Barbosa', patente: '1º Sgt', matricula: '890123', bpm: 'CIPE Leste' },
          { nome: 'Felipe Santos', patente: 'Cb', matricula: '901234', bpm: 'CIPE Leste' },
        ],
      },
      {
        protocolo: 'AR-2026/0095',
        dataFato: '2026-01-08',
        horaFato: '03:40',
        bpm: 'BPRv',
        municipio: 'Vitória da Conquista',
        bairro: 'BR-116 KM 812',
        logradouro: 'Rodovia BR-116, Km 812',
        narrativa:
          'Viatura do BPRv sinalizou para abordagem de caminhão em situação suspeita. Motorista desobedeceu a ordem de parada e avançou em direção à viatura. Passageiro efetuou disparos contra os policiais.',
        vitimasFatais: 1,
        feridos: 1,
        status: 'Registrada',
        tipoArma: 'Pistola',
        calibre: '9mm',
        disparos: 4,
        armaApreendida: true,
        policiais: [
          { nome: 'Roberto Alves', patente: '2º Ten', matricula: '012345', bpm: 'BPRv' },
          { nome: 'Sandro Pires', patente: '3º Sgt', matricula: '112233', bpm: 'BPRv' },
        ],
      },
      {
        protocolo: 'AR-2025/1847',
        dataFato: '2025-12-22',
        horaFato: '15:20',
        bpm: '12º BPM',
        municipio: 'Lauro de Freitas',
        bairro: 'Vilas do Atlântico',
        logradouro: 'Rua dos Coqueiros, 300',
        narrativa:
          'Patrulha do 12º BPM atendeu chamado de roubo em andamento. Ao chegar ao local, policiais foram recebidos a tiros pelos suspeitos. Em troca de tiros, um dos criminosos foi atingido fatalmente.',
        vitimasFatais: 1,
        feridos: 0,
        status: 'Concluída',
        tipoArma: 'Pistola',
        calibre: '.40 S&W',
        disparos: 3,
        armaApreendida: true,
        policiais: [
          { nome: 'Diego Carvalho', patente: 'Sd', matricula: '223344', bpm: '12º BPM' },
          { nome: 'Bruno Neto', patente: 'Cb', matricula: '334455', bpm: '12º BPM' },
        ],
        assinadoPor: '223344',
        assinadoEm: new Date('2025-12-23T09:15:00'),
      },
      {
        protocolo: 'AR-2025/1792',
        dataFato: '2025-12-15',
        horaFato: '22:00',
        bpm: '6º BPM',
        municipio: 'Salvador',
        bairro: 'São Caetano',
        logradouro: 'Rua Nova Brasília, 54',
        narrativa:
          'Policiais do 6º BPM realizavam patrulhamento quando avistaram grupo armado. Ao tentarem efetuar abordagem, foram recebidos a disparos. Reagiram em legítima defesa, resultando em um óbito.',
        vitimasFatais: 1,
        feridos: 2,
        status: 'Concluída',
        tipoArma: 'Revólver',
        calibre: '.38 SPL',
        disparos: 6,
        armaApreendida: false,
        policiais: [
          { nome: 'Antônio Gomes', patente: '1º Sgt', matricula: '445566', bpm: '6º BPM' },
          { nome: 'Paulo Rodrigues', patente: 'Sd', matricula: '556677', bpm: '6º BPM' },
        ],
        assinadoPor: '445566',
        assinadoEm: new Date('2025-12-16T14:30:00'),
      },
    ],
  })

  console.log('Seed concluído — 7 ocorrências inseridas.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
