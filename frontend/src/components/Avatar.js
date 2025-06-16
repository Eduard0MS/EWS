import React from 'react'

const Avatar = ({ user, size = 'md', className = '' }) => {
  // Gerar um seed único baseado no usuário
  const getSeed = user => {
    if (!user) return 'default'
    // Usar múltiplos campos para criar um seed mais único
    const identifier = user.id || user.username || user.email || 'default'
    return `${identifier}-${user.username || 'user'}`
  }

  // Definir tamanhos
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  }

  const seed = getSeed(user)
  // Adicionar mais variedade ao avatar
  const styles = ['bottts', 'bottts-neutral']
  const selectedStyle =
    styles[
      Math.abs(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) %
        styles.length
    ]

  const avatarUrl = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,ffeaa7&scale=80&radius=10`

  return (
    <div
      className={`${sizes[size]} ${className} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
    >
      <img
        src={avatarUrl}
        alt={`Avatar de ${user?.username || user?.first_name || 'Usuário'}`}
        className="w-full h-full object-cover"
        onError={e => {
          // Fallback para um avatar padrão se a imagem não carregar
          e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=default&backgroundColor=b6e3f4&scale=80`
        }}
      />
    </div>
  )
}

export default Avatar
