import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import ts from "typescript"

const require = createRequire(import.meta.url)
function loadSource(relativePath, resolve) {
    const source = readFileSync(new URL(relativePath, import.meta.url), "utf8")
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
    const compiledModule = { exports: {} }
    new Function("require", "module", "exports", outputText)(resolve, compiledModule, compiledModule.exports)
    return compiledModule.exports
}
const schema = loadSource("../../schema/letter.ts", require)
const letter = {
    id: "a5d105f1-d8d6-48b8-bfb6-348a3a117f48", slug: "a1b2c3d4",
    sender_name: "Sam", recipient_name: "Alex", theme: "Yellow", message: "Thank you for making ordinary days special.",
}
function setup(responses) {
    const calls = []
    const client = {
        from(table) {
            calls.push(["from", table])
            const query = {
                insert(payload) { calls.push(["insert", payload]); return query },
                select(columns) { calls.push(["select", columns]); return query },
                eq(key, value) { calls.push(["eq", key, value]); return query },
                single() { return Promise.resolve(responses.shift()) },
            }
            return query
        },
    }
    const { submitLetter } = loadSource("./submit-letter.ts", name => {
        if (name === "./client") return { createClient: () => client }
        if (name === "@/schema/letter") return schema
        return require(name)
    })
    return { submitLetter, calls }
}

test("inserts the validated payload and returns the saved slug", async () => {
    const { submitLetter, calls } = setup([{ data: { id: letter.id, slug: "saved123" }, error: null }])
    assert.deepEqual(await submitLetter(letter), { id: letter.id, slug: "saved123" })
    const inserted = calls.find(call => call[0] === "insert")[1]
    const { created_at, ...fields } = inserted
    assert.deepEqual(fields, letter)
    assert.equal(new Date(created_at).toISOString(), created_at)
    assert.ok(Math.abs(Date.now() - Date.parse(created_at)) < 5000)
    assert.deepEqual(calls, [["from", "letters"], ["insert", inserted], ["select", "id, slug"]])
})
test("invalid input never reaches Supabase", async () => {
    const { submitLetter, calls } = setup([])
    await assert.rejects(submitLetter({ ...letter, message: "Hi" }))
    assert.equal(calls.length, 0)
})
test("database and network errors reject rather than report success", async () => {
    const error = { code: "42501", message: "Permission denied" }
    const { submitLetter } = setup([{ data: null, error }])
    await assert.rejects(submitLetter(letter), value => value === error)
    const network = setup([Promise.reject(new Error("Connection lost"))])
    await assert.rejects(network.submitLetter(letter), /Connection lost/)
})
test("retry recovers an identical letter saved before a lost response", async () => {
    const { submitLetter, calls } = setup([
        { data: null, error: { code: "23505" } },
        { data: letter, error: null },
    ])
    assert.deepEqual(await submitLetter(letter), { id: letter.id, slug: letter.slug })
    assert.deepEqual(calls.at(-1), ["eq", "id", letter.id])
    assert.equal(calls.filter(call => call[0] === "insert").length, 1)
})
test("a conflicting or unreadable row is not mistaken for successful delivery", async () => {
    for (const existing of [{ data: { ...letter, message: "A different saved letter" }, error: null }, { data: null, error: { code: "42501" } }]) {
        const error = { code: "23505" }
        const { submitLetter } = setup([{ data: null, error }, existing])
        await assert.rejects(submitLetter(letter), value => value === error)
    }
})
test("a missing saved slug rejects instead of generating a broken link", async () => {
    const { submitLetter } = setup([{ data: { id: letter.id }, error: null }])
    await assert.rejects(submitLetter(letter))
})
