import css from "./output.css?raw";

export function App(props: {
  url: string,
  body: string
}) {
  async function addException(url: string) {
    const storageKey: string = "site_exceptions"
    let exceptions: string[] = [url]

    const currentExceptions = await chrome.storage.local.get([storageKey])
    if (currentExceptions[storageKey]) {
      exceptions = exceptions.concat(currentExceptions as string[])
    }

    let newKeys: Record<string, any> = {};
    newKeys[storageKey] = exceptions;

    await chrome.storage.local.set(newKeys);
    window.location.reload();
  }
  return (
    <>
      <style>
        {css}
      </style>
      <main className={"p-10 bg-white w-full min-h-screen absolute top-0 left-0 text-left mx-0"}>
        <h1 className={"text-4xl text-black font-semibold pb-4"}>Potential Scam detected</h1>
        <button id="scam-continue" className={"text-white text-xl px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-700"} onClick={() => { addException(props.url) }}>
          Mark <span className={"border-b border-b-white border-spacing-2"}>{props.url}</span> as safe?
        </button>
      </main>
    </>
  )
}
