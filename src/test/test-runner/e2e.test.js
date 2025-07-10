const username = "admin"
const password = "123"
const base64 = btoa(`${username}:${password}`);
const headers = {
    'Authorization': `Basic ${base64}`,
}


describe('Package service', () => {
    it('Should get latest state for package 1', async () => {
        let res
        res = await fetch(`http://kong:8000/api/package/1`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state:"OutForDelivery" })
            }
        )

        expect(res.ok).toBeTruthy()

        await new Promise((r) => setTimeout(r, 2000));

        res = await fetch(`http://kong:8000/api/package/1/state`, {headers})
        let body = await res.json()

        expect(body.state).toBe("OutForDelivery")

        res = await fetch(`http://kong:8000/api/package/1`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state:"Delivered" })
            }
        )

        expect(res.ok).toBeTruthy()

        await new Promise((r) => setTimeout(r, 2000));

        res = await fetch(`http://kong:8000/api/package/1/state`, {headers})
        body = await res.json()
        expect(body.state).toBe("Delivered")

    }, 20000)

    it('Should fail if body wrongly formatted', async () => {
        const res = await fetch(`http://kong:8000/api/package/1`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stat:"OutForDelivery" })
            }
        )

        expect(res.ok).not.toBeTruthy()
    })

    it('Should fail if state doesn\'t exist wrongly formatted', async () => {
        const res = await fetch(`http://kong:8000/api/package/1`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state:"OutForDeliver" })
            }
        )

        expect(res.ok).not.toBeTruthy()
    })
})