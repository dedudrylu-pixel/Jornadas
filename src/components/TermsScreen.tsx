import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { useState } from 'react';
import BrandLogo from '@/components/BrandLogo';

interface TermsScreenProps {
  onBack: () => void;
}

type Section = 'terms' | 'privacy';

export default function TermsScreen({ onBack }: TermsScreenProps) {
  const [section, setSection] = useState<Section>('terms');

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-black/90 backdrop-blur-xl px-4 py-3 border-b border-white/[0.06]">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white active:scale-90 transition-transform"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="text-lg font-bold text-white">Termos & Privacidade</span>
      </div>

      {/* Brand */}
      <div className="flex justify-center pt-6 pb-2">
        <BrandLogo size={20} textSize="text-xl" />
      </div>

      {/* Section toggle */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.06] p-1">
          <button
            onClick={() => setSection('terms')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
              section === 'terms'
                ? 'bg-white text-black'
                : 'text-white/50'
            }`}
          >
            <FileText size={15} /> Termos
          </button>
          <button
            onClick={() => setSection('privacy')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
              section === 'privacy'
                ? 'bg-white text-black'
                : 'text-white/50'
            }`}
          >
            <Shield size={15} /> Privacidade
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 space-y-6 text-sm leading-relaxed text-white/70">
        {section === 'terms' ? (
          <>
            <Block title="1. Aceitação dos Termos">
              Ao criar uma conta ou utilizar esta rede social de metas e evolução
              pessoal, você concorda com estes Termos de Uso. Se não concordar,
              não utilize a plataforma.
            </Block>
            <Block title="2. Descrição do Serviço">
              A plataforma permite que você registre metas pessoais, acompanhe
              seu progresso, compartilhe conquistas e interaja com outros
              usuários por meio de publicações, comentários e apoios. O serviço
              é destinado a fins de desenvolvimento pessoal e organização de
              objetivos.
            </Block>
            <Block title="3. Elegibilidade da Conta">
              Você deve ter pelo menos 13 anos para criar uma conta. As
              informações fornecidas no cadastro devem ser verdadeiras e você é
              responsável por manter a confidencialidade de sua senha.
            </Block>
            <Block title="4. Conduta do Usuário">
              Você concorda em não publicar conteúdo ofensivo, discriminatório,
              ilegal, que viole direitos de terceiros ou que incentive
              automutilação. Conteúdos que simulam conquistas falsas ou
              enganosas podem ser removidos. A plataforma reserva-se o direito
              de suspender contas que infrinjam estas regras.
            </Block>
            <Block title="5. Conteúdo do Usuário">
              Você mantém os direitos sobre o conteúdo que publicar. Ao
              compartilhar, concede à plataforma uma licença não exclusiva para
              exibi-lo dentro do serviço. Você é responsável pela veracidade e
              legalidade de tudo que publicar.
            </Block>
            <Block title="6. Encerramento de Conta">
              Você pode encerrar sua conta a qualquer momento. A plataforma
              também pode encerrar ou suspender contas que violem estes Termos.
              Após o encerramento, parte do conteúdo pode permanecer por um
              período para fins técnicos e legais.
            </Block>
            <Block title="7. Limitação de Responsabilidade">
              A plataforma é fornecida "como está" e não garante resultados
              pessoais a partir das metas registradas. Não nos responsabilizamos
              por decisões de vida tomadas com base em interações na plataforma.
              O serviço não substitui acompanhamento profissional de saúde
              física ou mental.
            </Block>
            <Block title="8. Alterações dos Termos">
              Podemos atualizar estes Termos periodicamente. Notificaremos sobre
              mudanças relevantes dentro do aplicativo. O uso continuado após a
              atualização constitui aceitação dos novos Termos.
            </Block>
          </>
        ) : (
          <>
            <Block title="1. Dados que Coletamos">
              Coletamos informações que você fornece ao criar a conta (nome,
              nome de usuário, e-mail), o conteúdo que publica (metas,
              conquistas, publicações) e dados de uso (interações, apoios,
              histórico de acesso) para melhorar a experiência.
            </Block>
            <Block title="2. Como Usamos Seus Dados">
              Utilizamos seus dados para exibir seu progresso, conectar você a
              outros usuários da comunidade, enviar notificações sobre
              conquistas e apoios, melhorar o serviço e garantir a segurança da
              plataforma.
            </Block>
            <Block title="3. Compartilhamento de Dados">
              Não vendemos seus dados pessoais. Seu conteúdo público (metas e
              conquistas compartilhadas) pode ser visto por outros usuários.
              Dados privados são acessados apenas por você e pela equipe da
              plataforma para fins operacionais e de segurança.
            </Block>
            <Block title="4. Perfil Público e Privado">
              Você pode definir quais metas e conquistas são públicas ou
              privadas. Conteúdo público fica visível para outros membros da
              comunidade. Conteúdo privado é visível apenas para você.
            </Block>
            <Block title="5. Segurança">
              Adotamos medidas técnicas e organizacionais para proteger seus
              dados, incluindo criptografia em trânsito e controle de acesso.
              Nenhum sistema é totalmente seguro, mas trabalhamos continuamente
              para proteger suas informações.
            </Block>
            <Block title="6. Seus Direitos">
              Você pode acessar, corrigir ou excluir seus dados a qualquer
              tempo dentro do aplicativo. Para solicitações específicas de
              privacidade, entre em contato pelo canal de suporte. O
              encerramento da conta resulta na remoção de seus dados pessoais
              dentro dos prazos técnicos aplicáveis.
            </Block>
            <Block title="7. Retenção de Dados">
              Mantemos seus dados pelo tempo necessário para fornecer o serviço
              e cumprir obrigações legais. Após o encerramento da conta, dados
              de uso anônimos podem ser mantidos para análise e melhoria.
            </Block>
            <Block title="8. Alterações desta Política">
              Podemos atualizar esta Política de Privacidade. Notificaremos
              sobre mudanças relevantes dentro do aplicativo. O uso continuado
              após a atualização constitui aceitação da nova política.
            </Block>
          </>
        )}

        <div className="pt-2 pb-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/[0.08] border border-white/[0.1] py-3 text-sm font-semibold text-white active:scale-95 transition-transform"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60">{children}</p>
    </section>
  );
}
