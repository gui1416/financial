"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Tags, Target, BarChart3, Lightbulb, BookOpen, Video, MessageCircle } from "lucide-react"

export function HelpContent() {
  const [activeSection, setActiveSection] = useState("getting-started")

  const sections = [
    {
      id: "getting-started",
      title: "Primeiros Passos",
      icon: Lightbulb,
      content: [
        {
          title: "Bem-vindo ao FinanceApp!",
          description: "Seu gerenciador financeiro pessoal está pronto para uso.",
          steps: [
            "Complete seu perfil nas Configurações",
            "Explore as categorias padrão ou crie suas próprias",
            "Adicione sua primeira transação",
            "Configure suas metas financeiras",
            "Acompanhe seus relatórios",
          ],
        },
      ],
    },
    {
      id: "transactions",
      title: "Transações",
      icon: CreditCard,
      content: [
        {
          title: "Gerenciando Transações",
          description: "Aprenda a adicionar, editar e organizar suas transações.",
          steps: [
            'Clique em "Nova Transação" para adicionar receitas ou despesas',
            "Preencha título, valor, categoria e data",
            "Use filtros para encontrar transações específicas",
            "Edite ou exclua transações conforme necessário",
            "Visualize o histórico completo na página de Transações",
          ],
        },
        {
          title: "Dicas para Transações",
          description: "Maximize o uso do sistema de transações.",
          steps: [
            "Use títulos descritivos para facilitar a busca",
            "Categorize corretamente para relatórios precisos",
            "Registre transações regularmente",
            "Use a busca por texto para encontrar transações rapidamente",
          ],
        },
      ],
    },
    {
      id: "categories",
      title: "Categorias",
      icon: Tags,
      content: [
        {
          title: "Organizando Categorias",
          description: "Personalize suas categorias para melhor organização.",
          steps: [
            "Acesse a página de Categorias",
            "Crie novas categorias com cores e ícones personalizados",
            "Separe categorias de receita e despesa",
            "Edite categorias existentes quando necessário",
            "Exclua categorias não utilizadas (cuidado com transações vinculadas)",
          ],
        },
      ],
    },
    {
      id: "goals",
      title: "Metas Financeiras",
      icon: Target,
      content: [
        {
          title: "Definindo Metas",
          description: "Configure e acompanhe suas metas financeiras.",
          steps: [
            "Acesse a página de Metas",
            'Clique em "Nova Meta" para criar uma meta',
            "Escolha entre meta de economia ou redução de gastos",
            "Defina valor alvo e prazo",
            "Acompanhe o progresso no dashboard",
          ],
        },
        {
          title: "Tipos de Metas",
          description: "Entenda os diferentes tipos de metas disponíveis.",
          steps: [
            "Metas de Economia: para juntar dinheiro (ex: reserva de emergência)",
            "Metas de Redução: para diminuir gastos em categorias específicas",
            "Defina prazos realistas para suas metas",
            "Monitore o progresso regularmente",
          ],
        },
      ],
    },
    {
      id: "reports",
      title: "Relatórios",
      icon: BarChart3,
      content: [
        {
          title: "Analisando seus Dados",
          description: "Use os relatórios para entender seus hábitos financeiros.",
          steps: [
            "Acesse a página de Relatórios",
            "Use filtros de período para análises específicas",
            "Analise a distribuição por categorias",
            "Compare gastos mensais",
            "Identifique tendências de receitas e despesas",
          ],
        },
      ],
    },
  ]

  const faqs = [
    {
      question: "Como posso exportar meus dados?",
      answer:
        "Atualmente, você pode visualizar todos os dados nos relatórios. A funcionalidade de exportação será implementada em breve.",
    },
    {
      question: "Posso usar o app em múltiplos dispositivos?",
      answer: "Sim! Seus dados são sincronizados automaticamente entre todos os dispositivos onde você fizer login.",
    },
    {
      question: "Como excluir minha conta?",
      answer: "Vá para Configurações > Zona de Perigo > Excluir Conta. Esta ação é irreversível.",
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim, utilizamos criptografia e políticas de segurança rigorosas para proteger seus dados financeiros.",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 md:grid-cols-5">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              <section.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-4">
            {section.content.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {item.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5 min-w-[24px] justify-center">
                          {stepIndex + 1}
                        </Badge>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Perguntas Frequentes
          </CardTitle>
          <CardDescription>Respostas para as dúvidas mais comuns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium">{faq.question}</h4>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
              {index < faqs.length - 1 && <hr className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precisa de mais ajuda?</CardTitle>
          <CardDescription>Nossa equipe está aqui para ajudar você.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Video className="h-4 w-4" />
              Assistir Tutoriais
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <BookOpen className="h-4 w-4" />
              Documentação
            </Button>
            <Button className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contatar Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}