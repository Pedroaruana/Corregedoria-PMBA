export function gerarProtocolo(): string {
  const ano = new Date().getFullYear()
  const numero = Math.floor(Math.random() * 9000) + 1000
  return `AR-${ano}/${numero}`
}
