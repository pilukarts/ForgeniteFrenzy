
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import Link from 'next/link';


const TermsOfServicePage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-headline text-primary flex items-center">
            <FileText className="mr-3 h-8 w-8 sm:h-10 sm:w-10" />
            Términos de Servicio
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Reglas de enfrentamiento para todos los Comandantes de la Alianza.
          </p>
        </header>

        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,120px)-var(--bottom-nav-h,56px)-var(--page-padding,48px))]">
          <div className="space-y-6 text-sm sm:text-base text-foreground/90">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">1. Aceptación de los Términos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Estos Términos de Servicio ("Términos") constituyen un acuerdo legalmente vinculante entre usted ("usted" o "Usuario") y [Tu Compañía/Estudio] ("nosotros", "nos" o "nuestro") que rige su uso del juego Alliance Forge ("Juego"). Al acceder, jugar o registrarse en nuestro Juego, usted acepta estar sujeto a estos Términos y a nuestra{' '}
                  <Link href="/legal/transparency-statement" className="text-primary hover:underline">
                    Declaración de Transparencia
                  </Link>. Si no está de acuerdo con estos Términos, no debe usar el Juego.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">2. Cuenta de Usuario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Elegibilidad:</strong> Debe tener al menos 13 años de edad para crear una cuenta y jugar.</p>
                <p><strong>Responsabilidad:</strong> Usted es responsable de mantener la confidencialidad de su cuenta y de todas las actividades que ocurran bajo ella. Acepta notificar inmediatamente cualquier uso no autorizado.</p>
                <p><strong>Conducta:</strong> Se prohíbe el uso de trampas, exploits, bots, hacks o cualquier software de terceros no autorizado para modificar o automatizar la jugabilidad. La violación de esta regla puede resultar en la suspensión o terminación de la cuenta.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">3. Activos Digitales y Propiedad Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Nuestra Propiedad Intelectual:</strong> El Juego, incluyendo todo el código, gráficos, personajes, nombres y otro contenido, es de nuestra propiedad o de nuestros licenciantes.</p>
                <p><strong>Bienes Virtuales:</strong> Le otorgamos una licencia limitada, no exclusiva, intransferible y revocable para usar los bienes virtuales (como Puntos y Auron) dentro del Juego para fines de juego. No tienen valor monetario real y no son canjeables por dinero.</p>
                <p><strong>Tokens No Fungibles (NFTs):</strong> Al adquirir un NFT, usted posee el token en la blockchain. Sin embargo, la propiedad intelectual del arte y los rasgos asociados permanece con nosotros. Le otorgamos una licencia para usar, mostrar y comercializar su NFT con fines personales y no comerciales.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">4. Código de Conducta del Jugador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Usted se compromete a no:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Utilizar lenguaje o compartir contenido que sea ilegal, abusivo, odioso o discriminatorio.</li>
                    <li>Hacerse pasar por otro jugador, un miembro del personal o cualquier otra persona.</li>
                    <li>Interrumpir el juego o los servidores, o afectar negativamente la experiencia de otros jugadores.</li>
                    <li>Participar en "comercio con dinero real" (RMT) de bienes virtuales o cuentas fuera de las plataformas de mercado de NFTs autorizadas.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">5. Terminación</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Nos reservamos el derecho de suspender o terminar su cuenta y acceso al Juego, sin previo aviso, por cualquier violación de estos Términos.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">6. Descargos de Responsabilidad y Limitación de Responsabilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>EL JUEGO SE PROPORCIONA "TAL CUAL". NO OFRECEMOS GARANTÍAS DE NINGÚN TIPO. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, NO SEREMOS RESPONSABLES DE NINGÚN DAÑO INDIRECTO, INCIDENTAL O CONSECUENTE.</p>
                <p>El valor de los activos de blockchain (NFTs, criptomonedas) es volátil. No somos responsables de ninguna pérdida financiera.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">7. Cambios a los Términos</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Podemos modificar estos Términos en cualquier momento. Le notificaremos los cambios significativos. Su uso continuado del Juego después de los cambios constituye su aceptación de los nuevos Términos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">8. Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                   Para preguntas sobre estos Términos, por favor contáctenos a través de nuestra{' '}
                   <Link href="/support" className="text-primary hover:underline">
                    página de soporte
                  </Link>.
                </p>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
        {/* CSS variables for dynamic height calculation */}
        <style jsx>{`
          :root {
            --app-header-h: 60px; 
            --page-header-h: 100px;
            --bottom-nav-h: 56px;
            --page-padding: 48px;
          }
           @media (min-width: 640px) { /* sm breakpoint */
            :root {
              --app-header-h: 68px;
              --page-header-h: 110px;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default TermsOfServicePage;

    