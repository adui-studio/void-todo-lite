// pages/index.tsx
import { action, useForm } from '@void/react';
import { useFormStatus } from 'react-dom';
import type { Props } from './index.server';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button className="primary-button" type="submit" disabled={pending}>
            <span>{pending ? '添加中...' : '添加 Todo'}</span>
        </button>
    );
}

export default function IndexPage({ todos }: Props) {
    const createForm = useForm('/?create', {
        title: '',
    });

    async function toggleTodo(id: number, completed: boolean) {
        await action('/?toggle', {
            data: {
                id,
                completed,
            },
        });
    }

    async function deleteTodo(id: number) {
        await action('/?delete', {
            data: {
                id,
            },
        });
    }

    const completedCount = todos.filter((todo) => todo.completed).length;
    const activeCount = todos.length - completedCount;

    return (
        <main className="page-shell">
            <section className="hero-card">
                <div className="hero-glow hero-glow-one" />
                <div className="hero-glow hero-glow-two" />

                <div className="header">
                    <div>
                        <p className="eyebrow">VOID · D1 · DRIZZLE · REACT</p>
                        <h1>Void Todo Lite</h1>
                        <p className="subtitle">
                            一个极简 TodoList，用 loader 读取数据，用 actions 完成新增、切换和删除。
                        </p>
                    </div>

                    <div className="status-pill">
                        <span className="pulse" />
                        Local D1 Ready
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">全部</span>
                        <strong>{todos.length}</strong>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">进行中</span>
                        <strong>{activeCount}</strong>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">已完成</span>
                        <strong>{completedCount}</strong>
                    </div>
                </div>

                <form className="todo-form" action={createForm.post}>
                    <div className="input-wrap">
                        <span className="input-icon">✦</span>
                        <input
                            name="title"
                            value={createForm.data.title}
                            onChange={(event) =>
                                createForm.setData('title', event.currentTarget.value)
                            }
                            placeholder="输入一个 Todo，比如：写 Void 初体验文章"
                        />
                    </div>

                    <SubmitButton />
                </form>

                {createForm.errors.title ? (
                    <p className="error-text">{createForm.errors.title}</p>
                ) : null}

                {createForm.error ? (
                    <p className="error-text">{createForm.error.message}</p>
                ) : null}

                <section className="todo-panel">
                    <div className="panel-header">
                        <h2>Todos</h2>
                        <span>{todos.length === 0 ? 'Empty state' : 'Synced'}</span>
                    </div>

                    {todos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-orb">⌁</div>
                            <h3>还没有 Todo</h3>
                            <p>先添加一条任务，体验 Void 的 loader + actions 全栈闭环。</p>
                        </div>
                    ) : (
                        <ul className="todo-list">
                            {todos.map((todo) => (
                                <li
                                    key={todo.id}
                                    className={todo.completed ? 'todo-item done' : 'todo-item'}
                                >
                                    <label className="todo-left">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleTodo(todo.id, todo.completed)}
                                        />

                                        <span className="custom-check" />

                                        <span className="todo-title">{todo.title}</span>
                                    </label>

                                    <button
                                        className="delete-button"
                                        type="button"
                                        onClick={() => deleteTodo(todo.id)}
                                        aria-label={`删除 ${todo.title}`}
                                    >
                                        删除
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section className="explain-panel">
                    <h2>Void 用法对应关系</h2>

                    <div className="explain-grid">
                        <div>
                            <strong>pages/index.tsx</strong>
                            <p>负责页面 UI，对应首页路由 /。</p>
                        </div>

                        <div>
                            <strong>pages/index.server.ts</strong>
                            <p>负责 loader 和 actions，处理读取和写入。</p>
                        </div>

                        <div>
                            <strong>db/schema.ts</strong>
                            <p>使用 Drizzle 定义 todos 表，并生成类型。</p>
                        </div>

                        <div>
                            <strong>D1</strong>
                            <p>作为 SQLite 数据库，存储 Todo 数据。</p>
                        </div>
                    </div>
                </section>
            </section>

            <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(126, 87, 255, 0.35), transparent 34rem),
            radial-gradient(circle at bottom right, rgba(0, 221, 255, 0.22), transparent 30rem),
            linear-gradient(135deg, #050816 0%, #0b1020 42%, #070912 100%);
          color: #f8fbff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        .page-shell {
          width: 100%;
          min-height: 100vh;
          padding: 56px 18px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
        }

        .page-shell::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        .hero-card {
          width: min(920px, 100%);
          position: relative;
          overflow: hidden;
          padding: 34px;
          border: 1px solid rgba(173, 190, 255, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(145deg, rgba(14, 19, 39, 0.92), rgba(8, 12, 28, 0.86)),
            rgba(255, 255, 255, 0.04);
          box-shadow:
            0 24px 90px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(22px);
        }

        .hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.7),
            rgba(34, 211, 238, 0.45),
            rgba(255, 255, 255, 0.04)
          );
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }

        .hero-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          filter: blur(32px);
          opacity: 0.5;
          pointer-events: none;
        }

        .hero-glow-one {
          top: -110px;
          right: -90px;
          background: rgba(124, 58, 237, 0.8);
        }

        .hero-glow-two {
          left: -120px;
          bottom: 80px;
          background: rgba(6, 182, 212, 0.42);
        }

        .header {
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .eyebrow {
          margin: 0 0 10px;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8be9ff;
        }

        h1 {
          margin: 0;
          font-size: clamp(40px, 8vw, 72px);
          line-height: 0.95;
          letter-spacing: -0.07em;
          background: linear-gradient(90deg, #ffffff, #c9d6ff 42%, #8be9ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .subtitle {
          max-width: 620px;
          margin: 18px 0 0;
          color: #aeb9d8;
          font-size: 16px;
          line-height: 1.75;
        }

        .status-pill {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(139, 233, 255, 0.25);
          background: rgba(139, 233, 255, 0.08);
          color: #c9f7ff;
          font-size: 13px;
          box-shadow: 0 0 28px rgba(34, 211, 238, 0.12);
        }

        .pulse {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22d3ee;
          box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.75);
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(34, 211, 238, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0);
          }
        }

        .stats-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 28px 0;
        }

        .stat-card {
          padding: 16px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.035));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .stat-label {
          display: block;
          margin-bottom: 8px;
          color: #8f9bbf;
          font-size: 13px;
        }

        .stat-card strong {
          font-size: 30px;
          line-height: 1;
        }

        .todo-form {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          margin: 26px 0 10px;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #8be9ff;
          pointer-events: none;
        }

        .input-wrap input {
          width: 100%;
          height: 52px;
          padding: 0 16px 0 44px;
          border: 1px solid rgba(173, 190, 255, 0.16);
          border-radius: 18px;
          outline: none;
          background: rgba(5, 9, 22, 0.72);
          color: #ffffff;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 0 0 0 rgba(139, 92, 246, 0);
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .input-wrap input::placeholder {
          color: #67718f;
        }

        .input-wrap input:focus {
          border-color: rgba(139, 233, 255, 0.58);
          background: rgba(8, 13, 31, 0.95);
          box-shadow:
            0 0 0 4px rgba(34, 211, 238, 0.12),
            0 0 28px rgba(124, 58, 237, 0.18);
        }

        .primary-button {
          height: 52px;
          min-width: 128px;
          border: 0;
          border-radius: 18px;
          color: #050816;
          cursor: pointer;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #8be9ff 45%, #a78bfa);
          box-shadow:
            0 14px 30px rgba(34, 211, 238, 0.18),
            0 0 34px rgba(124, 58, 237, 0.25);
          transition:
            transform 160ms ease,
            opacity 160ms ease,
            box-shadow 160ms ease;
        }

        .primary-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 18px 38px rgba(34, 211, 238, 0.26),
            0 0 42px rgba(124, 58, 237, 0.32);
        }

        .primary-button:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .error-text {
          margin: 10px 0 0;
          color: #ff8fa3;
          font-size: 14px;
        }

        .todo-panel {
          position: relative;
          margin-top: 26px;
          padding: 18px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(3, 7, 18, 0.42);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 16px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e9eeff;
        }

        .panel-header span {
          color: #7c88a8;
          font-size: 13px;
        }

        .empty-state {
          display: grid;
          place-items: center;
          text-align: center;
          min-height: 230px;
          padding: 28px;
          border: 1px dashed rgba(139, 233, 255, 0.22);
          border-radius: 20px;
          background:
            radial-gradient(circle at center, rgba(124, 58, 237, 0.18), transparent 62%),
            rgba(255, 255, 255, 0.025);
        }

        .empty-orb {
          width: 72px;
          height: 72px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 999px;
          color: #8be9ff;
          font-size: 34px;
          border: 1px solid rgba(139, 233, 255, 0.25);
          background: rgba(139, 233, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 34px rgba(34, 211, 238, 0.16);
        }

        .empty-state h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .empty-state p {
          max-width: 420px;
          margin: 0;
          color: #8f9bbf;
          line-height: 1.7;
        }

        .todo-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 58px;
          padding: 12px 12px 12px 14px;
          border: 1px solid rgba(173, 190, 255, 0.12);
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.025));
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .todo-item:hover {
          transform: translateY(-1px);
          border-color: rgba(139, 233, 255, 0.25);
          background:
            linear-gradient(180deg, rgba(139, 233, 255, 0.08), rgba(255, 255, 255, 0.03));
        }

        .todo-item.done {
          opacity: 0.72;
        }

        .todo-left {
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .todo-left input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .custom-check {
          width: 22px;
          height: 22px;
          flex: none;
          border-radius: 8px;
          border: 1px solid rgba(139, 233, 255, 0.36);
          background: rgba(3, 7, 18, 0.7);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .todo-left input:checked + .custom-check {
          border-color: transparent;
          background: linear-gradient(135deg, #8be9ff, #a78bfa);
          box-shadow: 0 0 24px rgba(139, 233, 255, 0.2);
        }

        .todo-left input:checked + .custom-check::after {
          content: "";
          position: absolute;
          left: 7px;
          top: 3px;
          width: 6px;
          height: 11px;
          border: solid #050816;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .todo-title {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #eef3ff;
        }

        .todo-item.done .todo-title {
          color: #7d88a8;
          text-decoration: line-through;
        }

        .delete-button {
          flex: none;
          border: 1px solid rgba(255, 143, 163, 0.22);
          border-radius: 14px;
          padding: 8px 12px;
          color: #ffb4c2;
          background: rgba(255, 143, 163, 0.07);
          cursor: pointer;
          transition:
            background 160ms ease,
            border-color 160ms ease,
            transform 160ms ease;
        }

        .delete-button:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 143, 163, 0.45);
          background: rgba(255, 143, 163, 0.13);
        }

        @media (max-width: 720px) {
          .page-shell {
            padding: 24px 12px;
          }

          .hero-card {
            padding: 22px;
            border-radius: 24px;
          }

          .header {
            flex-direction: column;
          }

          .status-pill {
            align-self: flex-start;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .todo-form {
            grid-template-columns: 1fr;
          }

          .primary-button {
            width: 100%;
          }

          .todo-item {
            align-items: stretch;
            flex-direction: column;
          }

          .delete-button {
            width: 100%;
          }
        }
        
        .explain-panel {
  position: relative;
  margin-top: 18px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(139, 233, 255, 0.14);
  background:
    linear-gradient(180deg, rgba(139, 233, 255, 0.06), rgba(255, 255, 255, 0.025));
}

.explain-panel h2 {
  margin: 0 0 14px;
  font-size: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.explain-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.explain-grid div {
  padding: 14px;
  border-radius: 16px;
  background: rgba(3, 7, 18, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.explain-grid strong {
  color: #8be9ff;
}

.explain-grid p {
  margin: 8px 0 0;
  color: #8f9bbf;
  line-height: 1.6;
  font-size: 14px;
}

@media (max-width: 720px) {
  .explain-grid {
    grid-template-columns: 1fr;
  }
}
      `}</style>
        </main>
    );
}