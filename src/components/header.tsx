import WhoImage from "@/assets/who.png";

export function Header() {
  return (
    <div className="flex items-center gap-2 justify-center p-4 bg-slate-950 rounded-t-lg">
      <img
        src={WhoImage}
        className="size-16"
        alt="Icone de um boneco com interrogação no lugar da cabeça"
      />
      <h1 className="text-4xl text-white">Quem sou eu?</h1>
    </div>
  );
}
