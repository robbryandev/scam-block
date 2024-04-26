import css from "./output.css?raw";

export function App(props: {
  url: string,
  body: string
}) {
  return (
    <>
      <style>
        {css}
      </style>
      <main className={"p-10 bg-white w-full min-h-screen absolute top-0 left-0 text-left mx-0"}>
        <h1 className={"text-4xl text-black font-semibold pb-4"}>Potential Scam detected</h1>
        <button id="scam-continue" className={"text-white text-xl px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-700"} onClick={() => {
          console.log("to-do: add exception storage")
        }}>
          Mark <span className={"border-b border-b-white border-spacing-2"}>{props.url}</span> as safe?
        </button>
      </main>

    </>
  )
}
