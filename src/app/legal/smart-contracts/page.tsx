
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SmartContractsPage: React.FC = () => {
  // En una aplicación real, esta sería la dirección del contrato verificado en un explorador de blockchain.
  const MOCK_CONTRACT_URL = "https://etherscan.io/address/0x0000000000000000000000000000000000000000";

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-headline text-primary flex items-center">
            <FileText className="mr-3 h-8 w-8 sm:h-10 sm:w-10" />
            Contratos Inteligentes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Garantizando la transparencia y la propiedad a través de la tecnología blockchain.
          </p>
        </header>

        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,120px)-var(--bottom-nav-h,56px)-var(--page-padding,48px))]">
          <div className="space-y-6 text-sm sm:text-base text-foreground/90">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">¿Qué es un Contrato Inteligente?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Un contrato inteligente es un programa autoejecutable con los términos del acuerdo entre las partes directamente escritos en el código. El código y los acuerdos que contiene existen a través de una red de blockchain descentralizada. Los contratos inteligentes permiten que se realicen transacciones y acuerdos de confianza entre partes anónimas y dispares sin la necesidad de una autoridad central, un sistema legal o un mecanismo de aplicación externo.
                </p>
                <p>
                  En Alliance Forge, los utilizamos para garantizar que la propiedad de activos únicos, como el <strong>Arca del Fundador NFT</strong>, sea verificable, inmutable y esté verdaderamente en manos del jugador.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Contrato del Arca del Fundador (AFS-ARK)</CardTitle>
                <CardDescription>
                  Este contrato rige la acuñación (creación) y propiedad de los NFTs del Arca del Fundador.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Estándar:</strong> ERC-721 (Estándar para Tokens No Fungibles)</p>
                <p><strong>Funcionalidad Clave:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Acuñación Segura:</strong> Solo los jugadores que han mejorado completamente su Hangar del Arca en el juego pueden acuñar un NFT del Arca del Fundador. Esta acción es iniciada por el jugador y verificada por el contrato.</li>
                    <li><strong>Propiedad Verificable:</strong> Cada NFT tiene un propietario único registrado en la blockchain. Puedes probar tu propiedad en cualquier momento sin depender de nuestros servidores.</li>
                    <li><strong>Transferibilidad:</strong> Como propietario, tienes la libertad de vender, intercambiar o transferir tu Arca del Fundador en cualquier mercado de NFTs compatible.</li>
                </ul>
              </CardContent>
              <CardFooter>
                 <a href={MOCK_CONTRACT_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Contrato en Explorador (Simulado)
                    </Button>
                </a>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Nuestra Filosofía de Transparencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Al publicar las direcciones de nuestros contratos inteligentes, ofrecemos una total transparencia. Cualquiera puede auditar el código para verificar que las reglas del juego son justas y se aplican según lo prometido. Este es nuestro compromiso para construir un ecosistema de juego abierto y fiable. Para más detalles, por favor consulta nuestra{' '}
                  <Link href="/legal/transparency-statement" className="text-primary hover:underline">
                    Declaración de Transparencia
                  </Link>.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
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

export default SmartContractsPage;
