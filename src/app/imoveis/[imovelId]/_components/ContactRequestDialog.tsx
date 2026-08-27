"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCreateLead } from "@/lib/api/hooks/use-create-lead";

export type ContactRequestDialogProps = {
  unidadeId: number;
  imovelTitulo: string;
};

export function ContactRequestDialog({
  unidadeId,
  imovelTitulo,
}: ContactRequestDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(user?.name ?? "");
  const [telefone, setTelefone] = useState("");
  const { mutate, isPending, isSuccess, isError, reset } = useCreateLead();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({
      tipo: "contato_imovel",
      nome,
      telefone,
      unidade_id: unidadeId,
      contexto: `Pedido de contato pela página do imóvel: ${imovelTitulo}`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">Agendar visita</Button>
      </DialogTrigger>
      <DialogContent>
        {isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Pedido enviado</DialogTitle>
              <DialogDescription>
                Recebemos seu pedido de contato. Nosso time entra em contato
                em breve pra combinar o melhor horário de visita.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)}>Fechar</Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Pedir contato para visitar</DialogTitle>
              <DialogDescription>
                Deixe seus dados que o time da Chaves entra em contato pra
                combinar o melhor horário. Isso ainda não é uma visita
                confirmada.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-nome">Nome</Label>
              <Input
                id="lead-nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-telefone">Telefone</Label>
              <Input
                id="lead-telefone"
                type="tel"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            {isError && (
              <p className="text-feedback-error text-sm">
                Não foi possível enviar seu pedido agora. Tente novamente.
              </p>
            )}

            <Button type="submit" loading={isPending} className="w-full">
              Enviar pedido
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
