"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCriarCorretor } from "@/lib/api/hooks/use-criar-corretor";
import { useAtualizarCorretor } from "@/lib/api/hooks/use-atualizar-corretor";
import { describeCorretorError } from "@/lib/corretor-errors";
import { CORRETOR_UF_OPTIONS } from "@/lib/corretor-labels";
import type { components } from "@/lib/api/generated/schema";

type Corretor = components["schemas"]["CorretorRead"];

const SEM_UF = "nenhuma";

/** Formulário de criar (`corretor: null`) ou editar (`corretor` existente) um corretor. */
export function CorretorFormulario({
  open,
  onOpenChange,
  corretor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  corretor: Corretor | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {corretor ? "Editar corretor" : "Novo corretor"}
          </DialogTitle>
          <DialogDescription>
            Nome e telefone são obrigatórios. Os demais campos são opcionais.
          </DialogDescription>
        </DialogHeader>

        {/* Desmontada enquanto fechada: cada abertura começa com os campos
            zerados (ou preenchidos com os dados atuais do corretor), sem
            precisar de um efeito para "resetar" o formulário. */}
        {open && (
          <CorretorFormularioCampos
            corretor={corretor}
            onSalvo={() => onOpenChange(false)}
            onCancelar={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CorretorFormularioCampos({
  corretor,
  onSalvo,
  onCancelar,
}: {
  corretor: Corretor | null;
  onSalvo: () => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(corretor?.nome ?? "");
  const [telefone, setTelefone] = useState(corretor?.telefone ?? "");
  const [email, setEmail] = useState(corretor?.email ?? "");
  const [fotoUrl, setFotoUrl] = useState(corretor?.foto_url ?? "");
  const [creciNumero, setCreciNumero] = useState(corretor?.creci_numero ?? "");
  const [creciUf, setCreciUf] = useState(corretor?.creci_uf ?? "");
  const [bio, setBio] = useState(corretor?.bio ?? "");
  const [cidade, setCidade] = useState(corretor?.cidade ?? "");
  const [instagram, setInstagram] = useState(
    corretor?.redes_sociais?.instagram ?? "",
  );
  const [linkedin, setLinkedin] = useState(
    corretor?.redes_sociais?.linkedin ?? "",
  );
  const [slug, setSlug] = useState(corretor?.slug ?? "");
  const [camposFaltando, setCamposFaltando] = useState(false);

  const criar = useCriarCorretor();
  const atualizar = useAtualizarCorretor(corretor?.id ?? 0);
  const mutacaoAtual = corretor ? atualizar : criar;

  const creciAlterado =
    creciNumero.trim() !== (corretor?.creci_numero ?? "") ||
    creciUf !== (corretor?.creci_uf ?? "");
  const slugAlterado = corretor !== null && slug.trim() !== corretor.slug;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      setCamposFaltando(true);
      return;
    }
    setCamposFaltando(false);

    const redesSociais =
      instagram.trim() || linkedin.trim()
        ? { instagram: instagram.trim() || null, linkedin: linkedin.trim() || null }
        : null;

    if (corretor) {
      atualizar.mutate(
        {
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim() || null,
          foto_url: fotoUrl.trim() || null,
          creci_numero: creciNumero.trim() || null,
          creci_uf: creciUf || null,
          bio: bio.trim() || null,
          cidade: cidade.trim() || null,
          redes_sociais: redesSociais,
          slug: slug.trim(),
        },
        { onSuccess: onSalvo },
      );
    } else {
      criar.mutate(
        {
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim() || null,
          foto_url: fotoUrl.trim() || null,
          creci_numero: creciNumero.trim() || null,
          creci_uf: creciUf || null,
          bio: bio.trim() || null,
          cidade: cidade.trim() || null,
          redes_sociais: redesSociais,
        },
        { onSuccess: onSalvo },
      );
    }
  }

  const erro = mutacaoAtual.isError
    ? describeCorretorError(mutacaoAtual.error, {
        creci: creciAlterado,
        slug: slugAlterado,
      })
    : null;
  const erroNoCreci = erro?.campo === "creci";
  const erroNoSlug = erro?.campo === "slug";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="corretor-nome">Nome</Label>
        <Input
          id="corretor-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="corretor-telefone">Telefone</Label>
        <Input
          id="corretor-telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="corretor-email">E-mail (opcional)</Label>
        <Input
          id="corretor-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="corretor-foto">Foto — URL (opcional)</Label>
        <Input
          id="corretor-foto"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="corretor-creci-numero">
            CRECI — número (opcional)
          </Label>
          <Input
            id="corretor-creci-numero"
            value={creciNumero}
            maxLength={20}
            aria-invalid={erroNoCreci}
            onChange={(e) => setCreciNumero(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="corretor-creci-uf">UF</Label>
          <Select
            value={creciUf || SEM_UF}
            onValueChange={(value) =>
              setCreciUf(value === SEM_UF ? "" : value)
            }
          >
            <SelectTrigger
              id="corretor-creci-uf"
              size="sm"
              className="w-20"
              aria-invalid={erroNoCreci}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SEM_UF}>—</SelectItem>
              {CORRETOR_UF_OPTIONS.map((uf) => (
                <SelectItem key={uf.value} value={uf.value}>
                  {uf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="corretor-cidade">Cidade / região de atuação (opcional)</Label>
        <Input
          id="corretor-cidade"
          value={cidade}
          maxLength={120}
          onChange={(e) => setCidade(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="corretor-bio">Bio (opcional)</Label>
        <Textarea
          id="corretor-bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="corretor-instagram">Instagram (opcional)</Label>
          <Input
            id="corretor-instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="corretor-linkedin">LinkedIn (opcional)</Label>
          <Input
            id="corretor-linkedin"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>
      </div>

      {corretor && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="corretor-slug">
            Slug (URL pública: /corretores/{slug || "…"})
          </Label>
          <Input
            id="corretor-slug"
            value={slug}
            aria-invalid={erroNoSlug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
      )}

      {camposFaltando && (
        <p className="text-feedback-error text-sm">
          Informe nome e telefone.
        </p>
      )}
      {erro && <p className="text-feedback-error text-sm">{erro.mensagem}</p>}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-11 md:h-8"
          disabled={mutacaoAtual.isPending}
          onClick={onCancelar}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="h-11 md:h-8"
          loading={mutacaoAtual.isPending}
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
