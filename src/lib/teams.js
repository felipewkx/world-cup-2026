const TEAMS = [
  { name: "France", namept: "França", rating: 97, flag: "🇫🇷", code: "FRA", confederation: "UEFA" },
  { name: "Spain", namept: "Espanha", rating: 96, flag: "🇪🇸", code: "ESP", confederation: "UEFA" },
  { name: "Argentina", namept: "Argentina", rating: 95, flag: "🇦🇷", code: "ARG", confederation: "CONMEBOL" },
  { name: "England", namept: "Inglaterra", rating: 94, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", confederation: "UEFA" },
  { name: "Portugal", namept: "Portugal", rating: 93, flag: "🇵🇹", code: "POR", confederation: "UEFA" },
  { name: "Brazil", namept: "Brasil", rating: 92, flag: "🇧🇷", code: "BRA", confederation: "CONMEBOL" },
  { name: "Netherlands", namept: "Holanda", rating: 91, flag: "🇳🇱", code: "NED", confederation: "UEFA" },
  { name: "Germany", namept: "Alemanha", rating: 90, flag: "🇩🇪", code: "GER", confederation: "UEFA" },
  { name: "Morocco", namept: "Marrocos", rating: 89, flag: "🇲🇦", code: "MAR", confederation: "CAF" },
  { name: "Belgium", namept: "Bélgica", rating: 88, flag: "🇧🇪", code: "BEL", confederation: "UEFA" },
  { name: "Croatia", namept: "Croácia", rating: 87, flag: "🇭🇷", code: "CRO", confederation: "UEFA" },
  { name: "Colombia", namept: "Colômbia", rating: 87, flag: "🇨🇴", code: "COL", confederation: "CONMEBOL" },
  { name: "Switzerland", namept: "Suíça", rating: 85, flag: "🇨🇭", code: "SUI", confederation: "UEFA" },
  { name: "Japan", namept: "Japão", rating: 84, flag: "🇯🇵", code: "JPN", confederation: "AFC" },
  { name: "United States", namept: "Estados Unidos", rating: 84, flag: "🇺🇸", code: "USA", confederation: "CONCACAF" },
  { name: "Mexico", namept: "México", rating: 83, flag: "🇲🇽", code: "MEX", confederation: "CONCACAF" },
  { name: "Iran", namept: "Irã", rating: 82, flag: "🇮🇷", code: "IRN", confederation: "AFC" },
  { name: "Ecuador", namept: "Equador", rating: 82, flag: "🇪🇨", code: "ECU", confederation: "CONMEBOL" },
  { name: "Turkey", namept: "Turquia", rating: 82, flag: "🇹🇷", code: "TUR", confederation: "UEFA" },
  { name: "Austria", namept: "Áustria", rating: 81, flag: "🇦🇹", code: "AUT", confederation: "UEFA" },
  { name: "South Korea", namept: "Coreia do Sul", rating: 80, flag: "🇰🇷", code: "KOR", confederation: "AFC" },
  { name: "Senegal", namept: "Senegal", rating: 80, flag: "🇸🇳", code: "SEN", confederation: "CAF" },
  { name: "Canada", namept: "Canadá", rating: 79, flag: "🇨🇦", code: "CAN", confederation: "CONCACAF" },
  { name: "Australia", namept: "Austrália", rating: 79, flag: "🇦🇺", code: "AUS", confederation: "AFC" },
  { name: "Algeria", namept: "Argélia", rating: 79, flag: "🇩🇿", code: "ALG", confederation: "CAF" },
  { name: "Egypt", namept: "Egito", rating: 78, flag: "🇪🇬", code: "EGY", confederation: "CAF" },
  { name: "Sweden", namept: "Suécia", rating: 77, flag: "🇸🇪", code: "SWE", confederation: "UEFA" },
  { name: "Ivory Coast", namept: "Costa do Marfim", rating: 77, flag: "🇨🇮", code: "CIV", confederation: "CAF" },
  { name: "Peru", namept: "Peru", rating: 76, flag: "🇵🇪", code: "PER", confederation: "CONMEBOL" },
  { name: "Poland", namept: "Polônia", rating: 76, flag: "🇵🇱", code: "POL", confederation: "UEFA" },
  { name: "Paraguay", namept: "Paraguai", rating: 75, flag: "🇵🇾", code: "PAR", confederation: "CONMEBOL" },
  { name: "Czech Republic", namept: "República Tcheca", rating: 75, flag: "🇨🇿", code: "CZE", confederation: "UEFA" },
  { name: "Scotland", namept: "Escócia", rating: 74, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO", confederation: "UEFA" },
  { name: "Panama", namept: "Panamá", rating: 74, flag: "🇵🇦", code: "PAN", confederation: "CONCACAF" },
  { name: "Norway", namept: "Noruega", rating: 74, flag: "🇳🇴", code: "NOR", confederation: "UEFA" },
  { name: "Tunisia", namept: "Tunísia", rating: 73, flag: "🇹🇳", code: "TUN", confederation: "CAF" },
  { name: "DR Congo", namept: "RD Congo", rating: 72, flag: "🇨🇩", code: "COD", confederation: "CAF" },
  { name: "Qatar", namept: "Catar", rating: 70, flag: "🇶🇦", code: "QAT", confederation: "AFC" },
  { name: "Iraq", namept: "Iraque", rating: 69, flag: "🇮🇶", code: "IRQ", confederation: "AFC" },
  { name: "South Africa", namept: "África do Sul", rating: 68, flag: "🇿🇦", code: "RSA", confederation: "CAF" },
  { name: "Saudi Arabia", namept: "Arábia Saudita", rating: 68, flag: "🇸🇦", code: "KSA", confederation: "AFC" },
  { name: "Jordan", namept: "Jordânia", rating: 67, flag: "🇯🇴", code: "JOR", confederation: "AFC" },
  { name: "Bosnia and Herzegovina", namept: "Bósnia e Herzegovina", rating: 67, flag: "🇧🇦", code: "BIH", confederation: "UEFA" },
  { name: "Cape Verde", namept: "Cabo Verde", rating: 66, flag: "🇨🇻", code: "CPV", confederation: "CAF" },
  { name: "Ghana", namept: "Gana", rating: 66, flag: "🇬🇭", code: "GHA", confederation: "CAF" },
  { name: "Curacao", namept: "Curaçao", rating: 61, flag: "🇨🇼", code: "CUW", confederation: "CONCACAF" },
  { name: "New Zealand", namept: "Nova Zelândia", rating: 60, flag: "🇳🇿", code: "NZL", confederation: "OFC" },
  { name: "Haiti", namept: "Haiti", rating: 58, flag: "🇭🇹", code: "HAI", confederation: "CONCACAF" },
];

export function getTeams() {
  return TEAMS.map(t => ({ ...t }));
}

export function getTeamName(team, lang) {
  return lang === 'pt' ? team.namept : team.name;
}

export default TEAMS;