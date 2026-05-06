import { useState } from "react"
import { supabase } from "./supabase"

const TMDB_KEY = "4b0416fe1a95d961d5bc9d6f6f5f8d75"

async function buscarImagemPersonagem(personagem, obra) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_KEY}&query=${encodeURIComponent(personagem)}&language=pt-BR`)
    const data = await res.json()
    const item = data.results?.[0]
    if (item?.profile_path) return `https://image.tmdb.org/t/p/w300${item.profile_path}`
    const res2 = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(obra)}&language=pt-BR`)
    const data2 = await res2.json()
    const item2 = data2.results?.[0]
    if (item2?.poster_path) return `https://image.tmdb.org/t/p/w300${item2.poster_path}`
    return null
  } catch { return null }
}

function Logo() {
  return (
    <span style={{fontSize:'24px', fontWeight:'700', letterSpacing:'-0.02em'}}>
      <span style={{color:'#ffffff'}}>Fan</span><span style={{color:'#60a5fa'}}>mark</span>
    </span>
  )
}

function ProgressBar({ step, total }) {
  return (
    <div style={{display:'flex', gap:'6px', marginBottom:'2rem'}}>
      {Array.from({length: total}).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: '4px', borderRadius: '2px',
          background: i < step ? '#2563eb' : '#1e3a5f'
        }}/>
      ))}
    </div>
  )
}

function Header({ step }) {
  return (
    <div style={{marginBottom:'2rem'}}>
      <Logo />
      <div style={{marginTop:'1.5rem'}}>
        <ProgressBar step={step} total={5} />
      </div>
      <p style={{color:'#60a5fa', fontSize:'13px', fontWeight:'500', letterSpacing:'0.1em', textTransform:'uppercase'}}>
        Etapa {step} de 5
      </p>
    </div>
  )
}

function Campo({ placeholder, value, onChange, small }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width:'100%', padding: small ? '10px 14px' : '14px 16px',
        borderRadius:'12px', background:'#1e3a5f33',
        border:'1px solid #1e3a5f', color:'#f1f5f9',
        fontSize: small ? '14px' : '16px', marginBottom:'8px',
        outline:'none', boxSizing:'border-box'
      }}
    />
  )
}

function Botao({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:'100%', padding:'16px', borderRadius:'12px',
      background: disabled ? '#1e3a5f' : '#2563eb',
      color:'#ffffff', fontSize:'16px', fontWeight:'600',
      border:'none', cursor: disabled ? 'not-allowed' : 'pointer',
      marginTop:'1rem'
    }}>
      {label}
    </button>
  )
}

function TelaInicial({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{background:'#0f172a'}}>
      <div className="text-center max-w-lg">
        <div style={{marginBottom:'2.5rem'}}><Logo /></div>
        <h1 className="text-4xl font-bold leading-tight mb-6" style={{color:'#f1f5f9'}}>
          Quais personagens ajudaram a formar quem você é?
        </h1>
        <p className="text-lg mb-4" style={{color:'#94a3b8'}}>
          Não é sobre o que você assiste. É sobre quem você carrega.
        </p>
        <p className="text-sm mb-10" style={{color:'#475569'}}>
          Personagens de filmes, séries, animes, games ou HQs.
        </p>
        <button onClick={onStart} className="text-white font-semibold px-8 py-4 rounded-full text-lg" style={{background:'#2563eb'}}>
          Descobrir meu DNA de Fã
        </button>
      </div>
    </div>
  )
}

function Etapa1({ onNext, dados, setDados }) {
  const personagens = dados.personagens
  function atualizarPersonagem(i, campo, valor) {
    const novos = [...personagens]
    novos[i] = {...novos[i], [campo]: valor}
    setDados({...dados, personagens: novos})
  }
  const valido = personagens.every(p => p.nome.trim() && p.obra.trim())
  return (
    <div className="min-h-screen flex flex-col px-6 py-10" style={{background:'#0f172a'}}>
      <div style={{maxWidth:'480px', margin:'0 auto', width:'100%'}}>
        <Header step={1} />
        <h2 style={{color:'#f1f5f9', fontSize:'28px', fontWeight:'700', lineHeight:'1.3', marginBottom:'0.5rem'}}>
          3 personagens que te representam
        </h2>
        <p style={{color:'#94a3b8', fontSize:'15px', marginBottom:'2rem'}}>
          Personagens com quem você se identifica de verdade — não só favoritos.
        </p>
        {personagens.map((p, i) => (
          <div key={i} style={{
            background:'#1e3a5f15', border:'1px solid #1e3a5f',
            borderRadius:'16px', padding:'1.25rem', marginBottom:'1rem'
          }}>
            <p style={{color:'#60a5fa', fontSize:'12px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem'}}>
              Personagem {i + 1}
            </p>
            <Campo placeholder="Nome do personagem..." value={p.nome} onChange={v => atualizarPersonagem(i, 'nome', v)}/>
            <Campo placeholder="De qual obra? (filme, série, anime...)" value={p.obra} onChange={v => atualizarPersonagem(i, 'obra', v)} small/>
          </div>
        ))}
        <Botao label="Continuar →" onClick={onNext} disabled={!valido}/>
      </div>
    </div>
  )
}

function Etapa2({ onNext, dados, setDados }) {
  const personagens = dados.personagens
  function atualizarMomento(i, valor) {
    const novos = [...personagens]
    novos[i] = {...novos[i], momento: valor}
    setDados({...dados, personagens: novos})
  }
  const valido = personagens.every(p => p.momento?.trim())
  return (
    <div className="min-h-screen flex flex-col px-6 py-10" style={{background:'#0f172a'}}>
      <div style={{maxWidth:'480px', margin:'0 auto', width:'100%'}}>
        <Header step={2} />
        <h2 style={{color:'#f1f5f9', fontSize:'28px', fontWeight:'700', lineHeight:'1.3', marginBottom:'0.5rem'}}>
          O momento que cada um te marcou
        </h2>
        <p style={{color:'#94a3b8', fontSize:'15px', marginBottom:'2rem'}}>
          Uma cena, uma fala, um arco — o instante que ficou para sempre.
        </p>
        {personagens.map((p, i) => (
          <div key={i} style={{
            background:'#1e3a5f15', border:'1px solid #1e3a5f',
            borderRadius:'16px', padding:'1.25rem', marginBottom:'1rem'
          }}>
            <p style={{color:'#60a5fa', fontSize:'12px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem'}}>
              {p.nome || `Personagem ${i+1}`}
            </p>
            <Campo
              placeholder={`O que ${p.nome || 'esse personagem'} fez que você nunca esquece?`}
              value={p.momento || ''}
              onChange={v => atualizarMomento(i, v)}
            />
          </div>
        ))}
        <Botao label="Continuar →" onClick={onNext} disabled={!valido}/>
      </div>
    </div>
  )
}

function Etapa3({ onNext, dados, setDados }) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-10" style={{background:'#0f172a'}}>
      <div style={{maxWidth:'480px', margin:'0 auto', width:'100%'}}>
        <Header step={3} />
        <h2 style={{color:'#f1f5f9', fontSize:'28px', fontWeight:'700', lineHeight:'1.3', marginBottom:'0.5rem'}}>
          1 vilão que você quase entende
        </h2>
        <p style={{color:'#94a3b8', fontSize:'15px', marginBottom:'2rem'}}>
          Aquele antagonista absurdamente bem escrito.
        </p>
        <div style={{background:'#1e3a5f15', border:'1px solid #1e3a5f', borderRadius:'16px', padding:'1.25rem', marginBottom:'1rem'}}>
          <Campo placeholder="Nome do vilão..." value={dados.vilao} onChange={v => setDados({...dados, vilao: v})}/>
          <Campo placeholder="De qual obra?" value={dados.vilaoObra || ''} onChange={v => setDados({...dados, vilaoObra: v})} small/>
        </div>
        <Botao label="Continuar →" onClick={onNext} disabled={!dados.vilao.trim()}/>
      </div>
    </div>
  )
}

function Etapa4({ onNext, dados, setDados }) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-10" style={{background:'#0f172a'}}>
      <div style={{maxWidth:'480px', margin:'0 auto', width:'100%'}}>
        <Header step={4} />
        <h2 style={{color:'#f1f5f9', fontSize:'28px', fontWeight:'700', lineHeight:'1.3', marginBottom:'0.5rem'}}>
          Games que marcaram sua vida
        </h2>
        <p style={{color:'#94a3b8', fontSize:'15px', marginBottom:'2rem'}}>
          Universos interativos também formam quem somos.
        </p>
        {dados.games.map((g, i) => (
          <Campo key={i} placeholder={`Game ${i+1}...`} value={g} onChange={v => {
            const n = [...dados.games]; n[i] = v; setDados({...dados, games: n})
          }}/>
        ))}
        <Botao label="Continuar →" onClick={onNext} disabled={dados.games.filter(g => g.trim()).length < 1}/>
      </div>
    </div>
  )
}

function Etapa5({ onNext, dados, setDados }) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-10" style={{background:'#0f172a'}}>
      <div style={{maxWidth:'480px', margin:'0 auto', width:'100%'}}>
        <Header step={5} />
        <h2 style={{color:'#f1f5f9', fontSize:'28px', fontWeight:'700', lineHeight:'1.3', marginBottom:'0.5rem'}}>
          Por que esses personagens importam pra você?
        </h2>
        <p style={{color:'#94a3b8', fontSize:'15px', marginBottom:'2rem'}}>
          O que eles te ensinaram? O que você carrega deles?
        </p>
        <textarea
          value={dados.frase}
          onChange={e => setDados({...dados, frase: e.target.value})}
          placeholder="Escreva sua resposta..."
          rows={4}
          style={{
            width:'100%', padding:'14px 16px', borderRadius:'12px',
            background:'#1e3a5f33', border:'1px solid #1e3a5f',
            color:'#f1f5f9', fontSize:'16px', marginBottom:'12px',
            outline:'none', boxSizing:'border-box', resize:'none',
            fontFamily:'inherit'
          }}
        />
        <Botao label="Ver meu DNA de Fã →" onClick={onNext} disabled={!dados.frase.trim()}/>
      </div>
    </div>
  )
}

function TelaDNA({ dados }) {
  const [imagens, setImagens] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)

  useState(() => {
    async function carregar() {
      const imgs = {}
      for (const p of dados.personagens) {
        if (p.nome.trim()) imgs[p.nome] = await buscarImagemPersonagem(p.nome, p.obra)
      }
      setImagens(imgs)
      setCarregando(false)
    }
    carregar()
  }, [])

  async function salvarPerfil() {
    setSalvando(true)
    const { error } = await supabase.from('perfis').insert({
      personagem1_nome: dados.personagens[0].nome,
      personagem1_obra: dados.personagens[0].obra,
      personagem1_momento: dados.personagens[0].momento,
      personagem2_nome: dados.personagens[1].nome,
      personagem2_obra: dados.personagens[1].obra,
      personagem2_momento: dados.personagens[1].momento,
      personagem3_nome: dados.personagens[2].nome,
      personagem3_obra: dados.personagens[2].obra,
      personagem3_momento: dados.personagens[2].momento,
      vilao: dados.vilao,
      vilao_obra: dados.vilaoObra,
      games: dados.games.filter(g => g.trim()),
      frase: dados.frase
    })
    setSalvando(false)
    if (!error) setSalvo(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10" style={{background:'#0f172a'}}>
      <div style={{
        maxWidth:'360px', width:'100%',
        background:'#060d1a',
        border:'1px solid #2563eb33',
        borderRadius:'28px', padding:'2rem 1.75rem',
        boxShadow:'0 0 80px #2563eb15',
        position:'relative', overflow:'hidden'
      }}>

        <div style={{
          position:'absolute', top:0, left:0, right:0, bottom:0,
          background:'radial-gradient(ellipse at 50% 30%, #1e3a5f44 0%, transparent 70%)',
          pointerEvents:'none'
        }}/>

        <div style={{position:'relative', display:'flex', flexDirection:'column', minHeight:'580px'}}>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'auto', paddingBottom:'2rem'}}>
            <Logo />
            <span style={{color:'#2563eb', fontSize:'10px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.1em', background:'#2563eb18', padding:'4px 10px', borderRadius:'999px', border:'1px solid #2563eb33'}}>DNA de Fã</span>
          </div>

          <div style={{marginTop:'auto'}}>
            <p style={{color:'#2563eb', fontSize:'10px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:'1.25rem'}}>
              Personagens que me formaram
            </p>

            <p style={{color:'#ffffff', fontSize:'30px', fontWeight:'800', lineHeight:'1.1', marginBottom:'4px', letterSpacing:'-0.02em'}}>
              {dados.personagens[0]?.nome}
            </p>
            <p style={{color:'#60a5fa', fontSize:'22px', fontWeight:'700', lineHeight:'1.1', marginBottom:'4px'}}>
              {dados.personagens[1]?.nome}
            </p>
            <p style={{color:'#94a3b8', fontSize:'18px', fontWeight:'600', lineHeight:'1.1', marginBottom:'1.75rem'}}>
              {dados.personagens[2]?.nome}
            </p>

            <div style={{height:'1px', background:'#2563eb22', marginBottom:'1.25rem'}}/>

            {dados.vilao && (
              <>
                <p style={{color:'#475569', fontSize:'10px', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.08em'}}>Vilão favorito</p>
                <p style={{color:'#f1f5f9', fontSize:'14px', fontWeight:'600', marginBottom:'1.25rem'}}>
                  {dados.vilao}
                  {dados.vilaoObra && <span style={{color:'#475569', fontWeight:'400'}}> — {dados.vilaoObra}</span>}
                </p>
                <div style={{height:'1px', background:'#2563eb22', marginBottom:'1.25rem'}}/>
              </>
            )}

            {dados.games.filter(g => g.trim()).length > 0 && (
              <>
                <p style={{color:'#475569', fontSize:'10px', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.08em'}}>Games</p>
                <p style={{color:'#94a3b8', fontSize:'13px', marginBottom:'1.25rem'}}>
                  {dados.games.filter(g => g.trim()).join(' · ')}
                </p>
                <div style={{height:'1px', background:'#2563eb22', marginBottom:'1.25rem'}}/>
              </>
            )}

            <div style={{background:'#2563eb12', borderRadius:'12px', padding:'12px', border:'1px solid #2563eb22', marginBottom:'1.5rem'}}>
              <p style={{color:'#f1f5f9', fontSize:'13px', fontStyle:'italic', lineHeight:'1.6'}}>"{dados.frase}"</p>
            </div>

            <button
              onClick={salvarPerfil}
              disabled={salvando || salvo}
              style={{
                width:'100%', padding:'14px', borderRadius:'14px',
                background: salvo ? '#16a34a' : '#2563eb',
                color:'#ffffff', fontSize:'15px',
                fontWeight:'600', border:'none', cursor: salvo ? 'default' : 'pointer',
                letterSpacing:'0.02em', marginBottom:'8px'
              }}>
              {salvo ? '✓ DNA salvo!' : salvando ? 'Salvando...' : 'Compartilhar meu DNA de Fã ✦'}
            </button>

            <p style={{color:'#1e3a5f', fontSize:'10px', textAlign:'center'}}>fanmark.app</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [tela, setTela] = useState('inicio')
  const [dados, setDados] = useState({
    personagens: [
      {nome:'', obra:'', momento:''},
      {nome:'', obra:'', momento:''},
      {nome:'', obra:'', momento:''}
    ],
    games: ['', '', ''],
    vilao: '',
    vilaoObra: '',
    frase: ''
  })

  return (
    <>
      {tela === 'inicio' && <TelaInicial onStart={() => setTela('etapa1')} />}
      {tela === 'etapa1' && <Etapa1 onNext={() => setTela('etapa2')} dados={dados} setDados={setDados}/>}
      {tela === 'etapa2' && <Etapa2 onNext={() => setTela('etapa3')} dados={dados} setDados={setDados}/>}
      {tela === 'etapa3' && <Etapa3 onNext={() => setTela('etapa4')} dados={dados} setDados={setDados}/>}
      {tela === 'etapa4' && <Etapa4 onNext={() => setTela('etapa5')} dados={dados} setDados={setDados}/>}
      {tela === 'etapa5' && <Etapa5 onNext={() => setTela('dna')} dados={dados} setDados={setDados}/>}
      {tela === 'dna' && <TelaDNA dados={dados}/>}
    </>
  )
}