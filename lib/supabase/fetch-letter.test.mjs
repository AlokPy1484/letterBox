import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import ts from "typescript"
const require = createRequire(import.meta.url)
function load(path, resolve) {
    const { outputText } = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
    const compiled = { exports: {} }
    new Function("require", "module", "exports", outputText)(resolve, compiled, compiled.exports)
    return compiled.exports
}
const base = load("../../schema/letter.ts", require)
const schema = load("../../app/types/letters.ts", name => name === "@/schema/letter" ? base : require(name))
const letter = { id: "a5d105f1-d8d6-48b8-bfb6-348a3a117f48", slug: "abc12345", sender_name: "Sam", recipient_name: "Alex", message: "This is a thoughtful letter.", theme: "Yellow", created_at: "2026-10-07T12:00:00Z" }
function setup(response) {
    const calls = []
    const client = { from(table) {
        calls.push(["from", table])
        const query = {
            select(columns) { calls.push(["select", columns]); return query },
            eq(key, value) { calls.push(["eq", key, value]); return query },
            abortSignal(signal) { calls.push(["abort", signal]); return query },
            maybeSingle() { return Promise.resolve(response) },
        }
        return query
    } }
    const { fetchLetter } = load("./fetch-letter.ts", name => name === "./client" ? { createClient: () => client } : name === "@/app/types/letters" ? schema : require(name))
    return { fetchLetter, calls }
}
test("fetches exactly the requested slug and validates the real row", async () => {
    const { fetchLetter, calls } = setup({ data: letter, error: null })
    assert.deepEqual(await fetchLetter(letter.slug), letter)
    assert.deepEqual(calls.slice(0, 3), [["from", "letters"], ["select", "*"], ["eq", "slug", letter.slug]])
})
test("an absent row becomes not found rather than placeholder data", async () => {
    const { fetchLetter } = setup({ data: null, error: null })
    assert.equal(await fetchLetter("missing"), null)
})
test("database and network failures reject", async () => {
    const error = { code: "42501", message: "Denied" }
    await assert.rejects(setup({ data: null, error }).fetchLetter(letter.slug), value => value === error)
    await assert.rejects(setup(Promise.reject(new Error("Offline"))).fetchLetter(letter.slug), /Offline/)
})
test("malformed data cannot reach the letter renderer", async () => {
    await assert.rejects(setup({ data: { ...letter, theme: "Demo" }, error: null }).fetchLetter(letter.slug))
})
test("an empty slug avoids a request and cancellation is forwarded", async () => {
    const { fetchLetter, calls } = setup({ data: null, error: null })
    assert.equal(await fetchLetter(""), null)
    assert.equal(calls.length, 0)
    const controller = new AbortController()
    await fetchLetter(letter.slug, controller.signal)
    assert.equal(calls.at(-1)[1], controller.signal)
})

test("a saved letter with a null timestamp still loads", async () => {
    const undated = { ...letter, created_at: null }
    const { fetchLetter } = setup({ data: undated, error: null })
    assert.deepEqual(await fetchLetter(letter.slug), undated)
})
