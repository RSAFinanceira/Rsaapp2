import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Minus, Plus, Upload, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import CadastroUsuarios from '@/components/CadastroUsuarios';

type Usuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'master' | 'padrao';
};

type Lead = {
  nome: string;
  cpf: string;
  telefone: string;
  valorLiberado: number;
};

const Dashboard = () => {
  const [quantidadeLeads, setQuantidadeLeads] = useState(10);
  const [vendedorSelecionado, setVendedorSelecionado] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const navigate = useNavigate();

  const usuarios: Usuario[] = [
    {
      id: 'rafael-master',
      nome: 'RafaelMaster',
      email: 'rafaeladdad@gmail.com',
      telefone: '(11) 99999-9999',
      tipo: 'master'
    },
    {
      id: 'rafael-teste',
      nome: 'Rafael Teste',
      email: 'rsacreditos@gmail.com',
      telefone: '(11) 98888-8888',
      tipo: 'padrao'
    },
    {
      id: 'beatriz-ribeiro',
      nome: 'Beatriz Ribeiro',
      email: 'arkrafaaddad@gmail.com',
      telefone: '(11) 97777-7777',
      tipo: 'padrao'
    }
  ];

  const handleSair = () => {
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/');
  };

  const handleImportarLeads = () => {
    if (!arquivo) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo CSV para importar.",
        variant: "destructive",
      });
      return;
    }

    // Simular processamento do CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Erro",
          description: "Arquivo CSV deve ter pelo menos um cabeçalho e uma linha de dados.",
          variant: "destructive",
        });
        return;
      }

      // Pular o cabeçalho (primeira linha)
      const dadosLeads = lines.slice(1).map(line => {
        const colunas = line.split(',').map(item => item.trim().replace(/"/g, ''));
        const [nome, cpf, telefone, valorStr] = colunas;
        
        // Processar valor liberado - remover R$, pontos e substituir vírgula por ponto
        let valorLiberado = 0;
        if (valorStr) {
          const valorLimpo = valorStr.replace(/R\$\s?/g, '').replace(/\./g, '').replace(/,/g, '.');
          valorLiberado = parseFloat(valorLimpo) || 0;
        }
        
        return {
          nome: nome || '',
          cpf: cpf || '',
          telefone: telefone || '',
          valorLiberado
        };
      }).filter(lead => lead.nome); // Filtrar leads vazios

      setLeads(dadosLeads);
      
      toast({
        title: "Leads importados",
        description: `${dadosLeads.length} leads processados com sucesso!`,
      });
    };
    
    reader.readAsText(arquivo);
  };

  const handleDistribuirLeads = () => {
    if (!vendedorSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um vendedor.",
        variant: "destructive",
      });
      return;
    }

    if (leads.length === 0) {
      toast({
        title: "Erro",
        description: "Importe leads antes de distribuir.",
        variant: "destructive",
      });
      return;
    }

    const vendedor = usuarios.find(u => u.id === vendedorSelecionado);
    const leadsParaDistribuir = leads.slice(0, quantidadeLeads);
    const valorTotal = leadsParaDistribuir.reduce((acc, lead) => acc + lead.valorLiberado, 0);

    toast({
      title: "✅ Leads distribuídos com sucesso!",
      description: `Distribuído ${quantidadeLeads} leads, no valor total de R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para ${vendedor?.nome}`,
      className: "border-green-500 bg-green-50 text-green-800",
    });

    // Remover leads distribuídos da lista
    setLeads(leads.slice(quantidadeLeads));
  };

  const adjustQuantidade = (increment: boolean) => {
    setQuantidadeLeads(prev => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.max(1, newValue);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center p-1">
              <img src={logo} alt="RSa Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-sm opacity-90">Promotora de Crédito</p>
              <h1 className="text-lg font-semibold">Sistema de Gestão de Leads</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Olá, Administrador</span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleSair}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto p-4">
        <Tabs defaultValue="gestao-leads" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="gestao-leads">Gestão de Leads</TabsTrigger>
            <TabsTrigger value="ranking-vendas">Ranking de Vendas</TabsTrigger>
            <TabsTrigger value="scripts-vendas">Scripts de Vendas</TabsTrigger>
            <TabsTrigger value="cadastrar-usuarios">Cadastrar Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="gestao-leads" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição de Leads */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Leads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Importar Leads (CSV)</Label>
                    <div className="text-xs text-muted-foreground mb-2">
                      Formato: NOME,CPF,TELEFONE,VALOR LIBERADO
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                        className="flex-1"
                        placeholder="Nenhum arquivo selecionado"
                      />
                      <Button onClick={handleImportarLeads} className="bg-primary hover:bg-primary/90">
                        <Upload className="h-4 w-4 mr-2" />
                        Importar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Selecione um vendedor</Label>
                    <Select value={vendedorSelecionado} onValueChange={setVendedorSelecionado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um vendedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {usuarios.map(usuario => (
                          <SelectItem key={usuario.id} value={usuario.id}>
                            {usuario.nome} ({usuario.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade de leads</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantidade(false)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantidadeLeads}
                        onChange={(e) => setQuantidadeLeads(parseInt(e.target.value) || 1)}
                        className="text-center w-20"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantidade(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleDistribuirLeads} 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Distribuir Leads
                  </Button>
                </CardContent>
              </Card>

              {/* Desempenho da Equipe */}
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    Dados de desempenho serão exibidos aqui
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visualização de Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Visualização de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NOME</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>TELEFONE</TableHead>
                      <TableHead>VALOR LIBERADO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          Nenhum lead importado
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map((lead, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{lead.nome}</TableCell>
                          <TableCell>{lead.cpf}</TableCell>
                          <TableCell>{lead.telefone}</TableCell>
                          <TableCell>R$ {lead.valorLiberado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking-vendas">
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Ranking de vendas em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scripts-vendas">
            <Card>
              <CardHeader>
                <CardTitle>Scripts de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Scripts de vendas em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cadastrar-usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <CadastroUsuarios usuarios={usuarios} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;