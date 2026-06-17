export type Patente =
  | 'Sd' | 'Cb' | '3º Sgt' | '2º Sgt' | '1º Sgt'
  | 'Sub Ten' | 'Asp' | '2º Ten' | '1º Ten'
  | 'Cap' | 'Maj' | 'TC' | 'Cel'

export type TipoArma =
  | 'Pistola' | 'Revólver' | 'Fuzil' | 'Espingarda' | 'Submetralhadora' | 'Carabina'

export type Calibre =
  | '9mm' | '.40 S&W' | '.380 ACP' | '.38 SPL' | '5.56mm' | '7.62mm' | '12' | '.357 Mag' | '.45 ACP'

export type StatusOcorrencia =
  | 'Registrada' | 'Em análise' | 'Aguardando assinatura' | 'Concluída'

export interface Policial {
  matricula: string
  nome: string
  patente: Patente
  emServico: boolean
}

export interface DadosGerais {
  protocolo: string
  dataFato: string
  horaFato: string
  bpm: string
  municipio: string
  bairro: string
  logradouro: string
}

export interface DadosArmamento {
  tipoArma: TipoArma
  calibre: Calibre
  disparosEfetuados: number
  armaApreendida: boolean
  tipoArmaApreendida: TipoArma | ''
  calibreApreendido: Calibre | ''
  municaoApreendida: number
}

export interface OcorrenciaData {
  dadosGerais: DadosGerais
  policiais: Policial[]
  armamento: DadosArmamento
  narrativa: string
  vitimasFatais: number
  feridos: number
  status: StatusOcorrencia
}
