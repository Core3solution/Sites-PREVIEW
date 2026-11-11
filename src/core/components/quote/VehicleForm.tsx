import { forwardRef } from 'react';
import type { VehicleInfo } from '../../lib/quote';

interface Props {
  vehicle: VehicleInfo;
  onChange: (patch: Partial<VehicleInfo>) => void;
  errors: { year?: string };
  highlightEssentials: boolean;
}

const label = 'flex flex-col gap-2 text-sm';
const hint = 'text-subtle';

/** Ficha do veículo. Não coleta nome, telefone ou outros dados pessoais. */
export const VehicleForm = forwardRef<HTMLInputElement, Props>(function VehicleForm({ vehicle, onChange, errors, highlightEssentials }, brandRef) {
  const essential = (value: string) => (highlightEssentials && !value.trim() ? '!border-accent' : '');
  return (
    <div className="grid grid-cols-2 gap-4">
      <label className={`${label} col-span-2 sm:col-span-1`}>
        <span className="text-muted">Marca <span className={hint}>(essencial)</span></span>
        <input id="veiculo-marca" ref={brandRef} className={`field ${essential(vehicle.brand)}`} value={vehicle.brand} onChange={(e) => onChange({ brand: e.target.value })} placeholder="Ex.: Porsche" maxLength={40} autoComplete="off" />
      </label>
      <label className={`${label} col-span-2 sm:col-span-1`}>
        <span className="text-muted">Modelo <span className={hint}>(essencial)</span></span>
        <input id="veiculo-modelo" className={`field ${essential(vehicle.model)}`} value={vehicle.model} onChange={(e) => onChange({ model: e.target.value })} placeholder="Ex.: 911 Carrera" maxLength={60} autoComplete="off" />
      </label>
      <label className={label}>
        <span className="text-muted">Ano <span className={hint}>(opcional)</span></span>
        <input
          id="veiculo-ano"
          className={`field ${errors.year ? '!border-red-400' : ''}`}
          value={vehicle.year}
          onChange={(e) => onChange({ year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          inputMode="numeric"
          placeholder="Ex.: 2023"
          autoComplete="off"
          aria-invalid={!!errors.year}
          aria-describedby={errors.year ? 'veiculo-ano-erro' : undefined}
        />
        {errors.year && (
          <span id="veiculo-ano-erro" className="text-[0.8rem] text-red-300" role="alert">
            {errors.year}
          </span>
        )}
      </label>
      <label className={label}>
        <span className="text-muted">Cor <span className={hint}>(opcional)</span></span>
        <input id="veiculo-cor" className="field" value={vehicle.color} onChange={(e) => onChange({ color: e.target.value })} placeholder="Ex.: Preto" maxLength={30} autoComplete="off" />
      </label>
      <label className={`${label} col-span-2`}>
        <span className="text-muted">Observações <span className={hint}>(opcional)</span></span>
        <textarea id="veiculo-obs" className="field min-h-24 resize-y" value={vehicle.notes} onChange={(e) => onChange({ notes: e.target.value })} placeholder="Ex.: interesse em proteger o capô e os faróis" maxLength={400} />
      </label>
    </div>
  );
});
