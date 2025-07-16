import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Usuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'master' | 'padrao';
};

interface CadastroUsuariosProps {
  usuarios: Usuario[];
}

const CadastroUsuarios = ({ usuarios: usuariosIniciais }: CadastroUsuariosProps) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: 'padrao' as 'master' | 'padrao'
  });

  const handleCadastrar = () => {
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.telefone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se email já existe
    const emailExiste = usuarios.some(u => u.email === novoUsuario.email);
    if (emailExiste) {
      toast({
        title: "Erro",
        description: "Este email já está cadastrado.",
        variant: "destructive",
      });
      return;
    }

    const usuario: Usuario = {
      id: `user-${Date.now()}`,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      telefone: novoUsuario.telefone,
      tipo: novoUsuario.tipo
    };

    setUsuarios([...usuarios, usuario]);
    setNovoUsuario({
      nome: '',
      email: '',
      telefone: '',
      tipo: 'padrao'
    });

    toast({
      title: "Usuário cadastrado",
      description: `${usuario.nome} foi cadastrado com sucesso!`,
    });
  };

  const handleRemover = (id: string) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario?.tipo === 'master') {
      toast({
        title: "Erro",
        description: "Não é possível remover usuários master.",
        variant: "destructive",
      });
      return;
    }

    setUsuarios(usuarios.filter(u => u.id !== id));
    toast({
      title: "Usuário removido",
      description: "Usuário removido com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Cadastro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Novo Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Vendedor</Label>
              <Input
                id="nome"
                placeholder="Ex: João Silva"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@empresa.com"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={novoUsuario.telefone}
                onChange={(e) => setNovoUsuario({ ...novoUsuario, telefone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Usuário</Label>
              <Select value={novoUsuario.tipo} onValueChange={(value: 'master' | 'padrao') => setNovoUsuario({ ...novoUsuario, tipo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCadastrar}
            className="w-full mt-4 bg-primary hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Cadastrar Usuário
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados ({usuarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NOME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>TELEFONE</TableHead>
                <TableHead>TIPO</TableHead>
                <TableHead className="w-[100px]">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.telefone}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      usuario.tipo === 'master' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/20 text-secondary-foreground'
                    }`}>
                      {usuario.tipo === 'master' ? 'Master' : 'Padrão'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {usuario.tipo !== 'master' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemover(usuario.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroUsuarios;