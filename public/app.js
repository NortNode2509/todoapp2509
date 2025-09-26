const statusEl = document.getElementById('status')
const listEl = document.getElementById('todo-list')
const formEl = document.getElementById('add-form')

function setStatus(type, message) {
    if (!statusEl) return
    if (!message) {
        statusEl.innerHTML = ''
        return
    }
    const cls = type === 'error' ? 'alert alert-danger' : type === 'warn' ? 'alert alert-warning' : 'alert alert-info'
    statusEl.innerHTML = `<div class="${cls}" role="status">${message}</div>`
}

async function fetchTodos() {
    setStatus('info', 'Loading...')
    try {
        const res = await fetch('/api/todo')
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Invalid response format')
        renderTodos(data)
        setStatus('', '')
    } catch (err) {
        setStatus('error', `Failed to load todos: ${err.message}`)
        renderTodos([])
    }
}

function renderTodos(todos) {
    listEl.innerHTML = ''
    if (!todos || todos.length === 0) {
        const row = document.createElement('div')
        row.className = 'row text-muted py-2'
        const col = document.createElement('div')
        col.className = 'col'
        col.textContent = 'No tasks yet.'
        row.appendChild(col)
        listEl.appendChild(row)
        return
    }

    const fragment = document.createDocumentFragment()
    for (const todo of todos) {
        const row = document.createElement('div')
        row.className = 'row align-items-center py-2 border-bottom'
        // Keep id for internal actions only, do not display
        row.dataset.id = String(todo.id)

        const colDescription = document.createElement('div')
        colDescription.className = 'col'
        colDescription.textContent = todo.description ?? ''

        const colPriority = document.createElement('div')
        colPriority.className = 'col col-md-2'
        colPriority.textContent = todo.priority ?? ''

        const colStatus = document.createElement('div')
        colStatus.className = 'col col-md-2'
        colStatus.textContent = todo.isDone ? 'Done' : 'Not done'

        const colActions = document.createElement('div')
        colActions.className = 'col col-md-2 text-end'
        const delBtn = document.createElement('button')
        delBtn.type = 'button'
        delBtn.className = 'btn btn-sm btn-outline-danger'
        delBtn.textContent = 'Delete'
        delBtn.addEventListener('click', () => handleDelete(todo.id))
        colActions.appendChild(delBtn)

        row.appendChild(colDescription)
        row.appendChild(colPriority)
        row.appendChild(colStatus)
        row.appendChild(colActions)
        fragment.appendChild(row)
    }
    listEl.appendChild(fragment)
}

async function handleDelete(id) {
    if (!id) return
    try {
        const res = await fetch(`/api/todo/${encodeURIComponent(id)}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
        await fetchTodos()
    } catch (err) {
        setStatus('error', `Failed to delete: ${err.message}`)
    }
}

async function handleAdd(e) {
    e.preventDefault()
    const formData = new FormData(formEl)
    const description = String(formData.get('description') || '').trim()
    const priority = String(formData.get('priority') || 'low')
    const isDone = formEl.querySelector('#isDone').checked
    if (!description) {
        setStatus('warn', 'Please enter a description')
        return
    }
    try {
        const res = await fetch('/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, priority, isDone })
        })
        if (!res.ok) throw new Error(`Create failed: ${res.status}`)
        formEl.reset()
        await fetchTodos()
    } catch (err) {
        setStatus('error', `Failed to add: ${err.message}`)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchTodos()
    if (formEl) formEl.addEventListener('submit', handleAdd)
})


