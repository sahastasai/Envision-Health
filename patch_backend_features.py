import re

with open('apps/backend/src/index.ts', 'r') as f:
    content = f.read()

new_routes = """  return c.json(decryptedResults)
})

app.put('/api/protected/patients/:id/medicalData', async (c) => {
  const id = c.req.param('id')
  const { type, payload } = await c.req.json()
  
  const patient: any = await c.env.DB.prepare('SELECT encrypted_medical_history FROM Patients WHERE id = ?').bind(id).first()
  if (!patient) return c.json({ error: 'Not found' }, 404)

  let medData: any = {}
  if (patient.encrypted_medical_history) {
    const decryptedStr = await decryptData(patient.encrypted_medical_history, c.env.AES_SECRET)
    try { medData = JSON.parse(decryptedStr) } catch (e) { }
  }

  if (type === 'prescription') {
    if (!medData.prescriptions) medData.prescriptions = []
    medData.prescriptions.push({ ...payload, date: new Date().toISOString(), id: uuidv4() })
  } else if (type === 'lab') {
    if (!medData.labs) medData.labs = []
    medData.labs.push({ ...payload, date: new Date().toISOString(), id: uuidv4() })
  }

  const encryptedHistory = await encryptData(JSON.stringify(medData), c.env.AES_SECRET)
  await c.env.DB.prepare('UPDATE Patients SET encrypted_medical_history = ? WHERE id = ?').bind(encryptedHistory, id).run()

  return c.json({ message: 'Updated successfully' })
})

// Inventory Routes
app.get('/api/protected/inventory', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM Inventory ORDER BY expiration_date ASC').all()
  return c.json(results)
})

app.post('/api/protected/inventory', async (c) => {
  const { itemName, category, quantity, expirationDate } = await c.req.json()
  const id = uuidv4()
  
  await c.env.DB.prepare(
    'INSERT INTO Inventory (id, item_name, category, quantity, expiration_date) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, itemName, category, quantity, expirationDate || null).run()
  
  return c.json({ message: 'Item added successfully', id })
})

app.put('/api/protected/inventory/:id', async (c) => {
  const id = c.req.param('id')
  const { quantity } = await c.req.json()
  await c.env.DB.prepare('UPDATE Inventory SET quantity = ? WHERE id = ?').bind(quantity, id).run()
  return c.json({ message: 'Updated successfully' })
})

// Grants & Scraper AI Matcher"""

content = content.replace("  return c.json(decryptedResults)\n})\n\n// Grants & Scraper AI Matcher", new_routes)

with open('apps/backend/src/index.ts', 'w') as f:
    f.write(content)
