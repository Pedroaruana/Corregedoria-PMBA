-- CreateTable
CREATE TABLE "Ocorrencia" (
    "id" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "dataFato" TEXT NOT NULL,
    "horaFato" TEXT NOT NULL,
    "bpm" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "narrativa" TEXT NOT NULL,
    "vitimasFatais" INTEGER NOT NULL,
    "feridos" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Registrada',
    "tipoArma" TEXT NOT NULL,
    "calibre" TEXT NOT NULL,
    "disparos" INTEGER NOT NULL,
    "armaApreendida" BOOLEAN NOT NULL,
    "policiais" JSONB NOT NULL,
    "assinadoPor" TEXT,
    "assinadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ocorrencia_protocolo_key" ON "Ocorrencia"("protocolo");
