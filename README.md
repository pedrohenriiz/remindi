# Remindi

> Aplicativo de lembretes de medicamentos desenvolvido com React Native + Expo

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)

---

## Sobre o projeto

O Remindi é um aplicativo de lembretes de medicamentos que ajuda o usuário a gerenciar seus remédios do dia a dia. É possível cadastrar medicamentos, definir horários e dias da semana, e receber notificações locais como lembretes. O app mantém um histórico completo de doses — administradas, puladas ou omitidas — e registra o histórico de dosagens ao longo do tempo.

---

## Funcionalidades

-  **Cadastro de medicamentos** — nome, tipo, dosagem e horários
-  **Notificações locais** — lembretes automáticos nos horários agendados
-  **Ritmo semanal** — seleção de dias da semana específicos
-  **Modo intervalo** — geração automática de horários por intervalo (ex: de 8 em 8 horas)
-  **Registro de doses** — marcar doses como administrada, pulada ou omitida
-  **Histórico de dosagens** — rastreamento de mudanças de dosagem ao longo do tempo
-  **Tela de histórico** — calendário com aderência diária

---

## Tecnologias

| Categoria     | Tecnologia                             |
| ------------- | -------------------------------------- |
| Framework     | React Native + Expo                    |
| Linguagem     | TypeScript                             |
| Navegação     | React Navigation (Stack + Bottom Tabs) |
| Formulários   | React Hook Form + Zod                  |
| Notificações  | expo-notifications                     |
| Armazenamento | AsyncStorage                           |
| Ícones        | Lucide React Native                    |
| Calendário    | react-native-calendars                 |

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- App Expo Go no celular
- Android studio configurado para rodar na sua máquina

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/remindi.git
cd remindi

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npx expo start
```
Para testar localmente, copie o arquivo .env.example e renomeie para .env. Depois disso, preencha as variáveis de ambientes necessárias.

Escaneie o QR code com o app Expo Go para rodar no seu dispositivo.

---

## Decisões de arquitetura

### Event Storming

O domínio foi modelado utilizando Event Storming. Acesse o link a seguir para verificar a documentação: ([Event Storming - Remindi - Notion](https://destiny-nation-8a6.notion.site/Event-Storming-Remindi-3447fc999ce8808ab0ddd92a678092ff?pvs=73))

### Status da dose

| Status         | Descrição                                 |
| -------------- | ----------------------------------------- |
| `administered` | Usuário confirmou que tomou o medicamento |
| `skipped`      | Usuário optou conscientemente por pular   |
| `missed`       | Sem resposta à notificação                |
| `pending`      | Agendada mas ainda não chegou o horário   |

---

## Screenshots

<img width="375" height="792" alt="2026-06-08_17h57_06" src="https://github.com/user-attachments/assets/1e9bb392-e322-4733-9c0f-a1909d252d3a" />

<img width="375" height="792" alt="image" src="https://github.com/user-attachments/assets/537d2505-b528-480b-b0fb-529ad2db8178" />


---

## Licença

MIT License — sinta-se à vontade para usar este projeto como referência.

---

<p align="center">Feito com ❤️ por Pedro Henrique Savarezzi Maria.</p>
