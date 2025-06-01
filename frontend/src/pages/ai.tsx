export default function Ai() {
  return (
    <main className="w-full h-full flex justify-center">
      <div className="h-full flex flex-col w-1/2 ">
        <div className="w-full h-1/2">
          <p>Text</p>
        </div>
        <form className="flex flex-col w-full h-1/2 justify-end">
          <input className="rounded-xl text-l pt-4 pb-4 pl-6 pr-6 mb-4" />
        </form>
      </div>
    </main>
  );
}
