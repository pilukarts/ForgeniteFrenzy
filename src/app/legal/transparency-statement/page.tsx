
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldQuestion } from 'lucide-react';
import Link from 'next/link';

const TransparencyStatementPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-headline text-primary flex items-center">
            <ShieldQuestion className="mr-3 h-8 w-8 sm:h-10 sm:w-10" />
            Declaración de Transparencia
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Nuestro compromiso con la claridad respecto a los activos digitales y las economías de juego.
          </p>
        </header>

        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,120px)-var(--bottom-nav-h,56px)-var(--page-padding,48px))]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Introducción</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  Bienvenido a Alliance Forge. Esta declaración describe información clave sobre cómo
                  los activos digitales, incluyendo Tokens No Fungibles (NFTs), criptomonedas
                  y bienes virtuales, funcionan dentro de nuestro juego. Nuestro objetivo es proporcionar una
                  comprensión clara de estos elementos para asegurar una experiencia de juego transparente y justa.
                </p>
                <p>
                  Por favor, lee esta declaración detenidamente. Al participar en Alliance Forge e interactuar
                  con sus activos digitales, reconoces y aceptas los términos aquí descritos y nuestros{' '}
                  <Link href="/legal/terms-of-service" className="text-primary hover:underline">
                    Términos de Servicio
                  </Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Tokens No Fungibles (NFTs)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Definición:</strong> Los NFTs son identificadores digitales únicos registrados en una blockchain,
                  utilizados para certificar la propiedad de un activo digital específico. En Alliance Forge,
                  los NFTs pueden representar objetos como el "Arca del Fundador" u otros coleccionables únicos.
                </p>
                <p>
                  <strong>Adquisición:</strong> Los NFTs dentro de Alliance Forge se obtienen a través de logros
                  significativos en el juego, participación en eventos especiales o compras específicas
                  donde se indique explícitamente.
                </p>
                <p>
                  <strong>Propiedad y Blockchain:</strong> Cuando adquieres un NFT de Alliance Forge,
                  se asocia con la dirección de tu monedero de criptomonedas conectado en la blockchain de [Especificar Blockchain, ej. Polygon, Ethereum].
                  Tienes control sobre este NFT en tu monedero, sujeto a las reglas de la red de la blockchain.
                </p>
                <p>
                  <strong>Utilidad:</strong> La utilidad de los NFTs dentro de Alliance Forge será descrita
                  en el punto de adquisición o en la documentación oficial del juego. La utilidad puede incluir
                  beneficios en el juego, mejoras cosméticas o acceso a contenido exclusivo.
                </p>
                <p>
                  <strong>Comercio y Valor:</strong> Eres libre de intercambiar, vender o transferir tus NFTs en mercados de terceros
                  que soporten la blockchain y el estándar de NFT correspondiente. Alliance Forge no opera estos mercados
                  y no es responsable de las transacciones realizadas en ellos. El valor de los NFTs es determinado por el mercado y la comunidad.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Criptomonedas y Moneda del Juego</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                 <p>
                  <strong>Auron (Moneda Premium del Juego):</strong> Auron es una moneda virtual interna del juego
                  utilizada para comprar objetos premium, mejoras o contenido cosmético en Alliance Forge.
                  Auron se adquiere principalmente a través de la conexión de un monedero de criptomonedas o mediante compras directas.
                  Auron es una moneda virtual interna y NO es una criptomoneda. Existe solo dentro del ecosistema del juego.
                </p>
                <p>
                  <strong>Puntos (Moneda Estándar del Juego):</strong> Los Puntos son la moneda principal que se gana
                  a través del juego (ej. tocando, completando misiones). Se utilizan para mejoras estándar y progresión.
                  Los Puntos son un bien virtual con utilidad únicamente dentro del juego.
                </p>
                <p>
                  <strong>Futuro Token de Criptomoneda:</strong> Alliance Forge planea introducir su propio token de criptomoneda en el futuro.
                  Los detalles sobre dicho token, incluyendo su utilidad, economía (tokenomics) y distribución (ej. mecánicas de airdrop basadas en el "Puntaje de Fundador"),
                  serán proporcionados en un whitepaper o anuncio oficial separado. Trata con extrema precaución cualquier afirmación sobre un token de Alliance Forge existente fuera de los anuncios oficiales.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Bienes Virtuales</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Naturaleza:</strong> Los bienes virtuales en Alliance Forge incluyen todos los objetos del juego,
                  monedas (Puntos, Auron), personajes, mejoras y otro contenido digital que se puede
                  adquirir o usar dentro del juego.
                </p>
                <p>
                  <strong>Licencia:</strong> Cuando adquieres bienes virtuales, se te otorga una licencia limitada, no transferible,
                  revocable para usar estos bienes dentro del juego, de acuerdo con nuestros{' '}
                   <Link href="/legal/terms-of-service" className="text-primary hover:underline">
                    Términos de Servicio
                  </Link>.
                  No posees la propiedad intelectual subyacente de estos bienes virtuales.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Propiedad y Licencia</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Juego y Propiedad Intelectual:</strong> Alliance Forge y todo su contenido asociado,
                  incluyendo software, gráficos, personajes e historias, son propiedad de [Tu Compañía/Estudio]
                  o sus licenciantes y están protegidos por derechos de autor y otras leyes de propiedad intelectual.
                </p>
                <p>
                  <strong>Propiedad de NFT:</strong> Para los NFTs acuñados por Alliance Forge, la propiedad del token
                  específico en la blockchain se te transfiere a ti tras la adquisición. Sin embargo, la propiedad
                  intelectual subyacente (ej. el arte o diseño del personaje asociado con el NFT) permanece con [Tu Compañía/Estudio]
                  o sus licenciantes. Tu propiedad del NFT te otorga ciertos derechos para usar y mostrar el arte asociado,
                  típicamente para fines personales y no comerciales, según se detalla en nuestros{' '}
                  <Link href="/legal/terms-of-service" className="text-primary hover:underline">
                    Términos de Servicio
                  </Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Riesgos y Divulgaciones</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Volatilidad del Mercado (NFTs y Cripto):</strong> El valor de los NFTs y las criptomonedas
                  puede ser extremadamente volátil. No hay garantía de valor o liquidez para ningún activo digital.
                </p>
                <p>
                  <strong>Incertidumbre Regulatoria:</strong> El panorama regulatorio para los activos digitales
                  está en evolución. Los cambios en la regulación podrían afectar el uso, transferencia o valor
                  de estos activos.
                </p>
                <p>
                  <strong>Seguridad:</strong> Eres responsable de la seguridad de tu monedero de criptomonedas
                  y de cualquier activo digital almacenado en él.
                </p>
                <p>
                  <strong>No es Asesoramiento de Inversión:</strong> La información proporcionada por Alliance Forge
                  no debe ser interpretada como asesoramiento financiero o de inversión.
                </p>
                 <p>
                  <strong>Desarrollo del Juego:</strong> Alliance Forge es un juego en evolución. Las características,
                  objetos y el equilibrio económico pueden cambiar. Nos reservamos el derecho de modificar
                  o descontinuar aspectos del juego.
                </p>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  Si tienes alguna pregunta, por favor contáctanos a través de la{' '}
                  <Link href="/support" className="text-primary hover:underline">
                    página de soporte
                  </Link>.
                </p>
                <p>
                  Última Actualización: [Fecha Actual]
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        {/* CSS variables for dynamic height calculation */}
        <style jsx>{`
          :root {
            --app-header-h: 60px; 
            --page-header-h: 100px; /* Approx height of page title + desc */
            --bottom-nav-h: 56px;
            --page-padding: 48px; /* Sum of py-4/py-6 top and bottom padding for the page container */
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

export default TransparencyStatementPage;
    

    