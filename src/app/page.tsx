
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { User, UserRound, CheckCircle2, ShieldEllipsis } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, switchCommanderSex } = useGame();

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            Error: Player profile not loaded.
        </div>
    );
  }
  
  const backgroundImageStyle = {
    backgroundImage: "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAKUAsgMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAACAAEDBAYFCP/EAEkQAAECAwIHDAcGBAUFAAAAAAIAAQMREgQhBSIxMkFCUgYTUWFicpKhscHR8BRTgYKRouEVFiNWcZQzQ2OyNFRkg5MkVXOj8v/EABoBAAMBAQEBAAAAAAAAAAAAAAABAgMEBgX/xAAlEQACAgEEAgMAAwEAAAAAAAAAAQIREgMxQVETIQQUYUJScSL/2gAMAwEAAhEDEQA/AKcMYFBRs6EJS3wxz3yyEWdvi7qQcJkH+HHex53W8pX/AKJDabNaIO8nDGGJFPFuZn4bmfsSbBUQ8ayxIMbkgeN8HZl6Q87Sv/ohK0Rzxt9LGzqbvi+V0DApisVrhfxbNEH3ULYmdi85BdrgQw1KMBOBCrEMhQZykyMbMpBsitQyFWYZw0HPPVkigNi5KkawFsrqwjhqyESAolJrghaknycNsHlspfZxbK0LRICd4kBZ+Z9F+/7Izj2AtlAVh5K0RxICrxDhLSM2+CJTkuTgFZFGVmXZiHCVWIQrQqGtJnLKAoihLoRCFVjcUjpjJspkCcIseF/CiEPNJ0ZOmaBEPMhl2dqDS+yUMK2sMU4m+DsxRq+qeG8C11FSMMhGZCAyaWl9NyEsHRADfIpUiXnTJARQLOBQ4UTOGRkN5O2lm0M3td0ENR/juO1ns0r7XBn7ElA0ewyb/pg9p3pky6ZzWtYnjHCL3T7nZThaIXrIg84WfsdUIkEay9HIaasUSKT6OGXCmcYgZ4+XaaLQWd2BhKPC/hW2n3iZvhkVwMMWnWi2eJzqe9mdZdjRNERSZLiaobeJ52D7OXN+jqeHEgHjfZ5DzYsup2WYhQ68+IMOrNq0tw8SnGzxNQhLmklijJyXZpGazf5a1DzSZ+5EzWb/AFo/7TOs3K0hte6X1T7/AGsPXfMjH9FvyjTNvHr7R70D6qQRgf50h50All2t1p9fE6TomwjafXxOk6Mf0MP8NTTZv+4f+h/FSDZxPG9NL/gJu11k2wjafXxOkn+0bT6+J0ksX2Lx/iNQcOAGfbS/4CQUWT/NxvdgEsy+EbT6+J0kL260+vidJ0YvsFD8RpSh2T19qL/YdQRhh/yodoic8aVwGtFpPG3yJ0/qhI4mvH+Yk8f0Z23b/SF70X6KMjo/kWcecU+9cQnHOMohDdmjlm07pqI6TCqFVi5wll/Vk6Q02dgsIRwxQ9HHov2zUETCUc8U7bSOyJF2MzMuK8RMzRDzBJOkaUXolohZxxyLmh3u6iaPDMxHGzsYjOTNwu8mVSIBBnEPNqafwQwHGuktYZCXA73t4e1Foq/Xot+nQGuazk7aMYklS3s2ucYU24cqSWSH67JWjbYjnPnXKQQhni73wZpN1ZFVA68YCES6lMJxNekvdn3TWaY5wrYZgh0aw8oSbseSkERDGxi5weWdCUQTCmkR6XfckA0Hj/2t2M+ROyPfJKR0RqiESKqZCU3Zr8nGprPTaDL8OnTiDPTxNNV3avF1qcXLfxfqrNpssOFvW9R98qnVUMpeCLIlW3JYcKP55D0m7UzEWLTHHG2ibrm1yrA5BmxCHJrN3Op29Joq38SGnWJnfLwXugjGt2TMUfGoiCVOdku9rOyje0lr/ML+KEDj4whT+JnYpNoldcgeDEzShli8nJ9EAoq/ZL6TyYfRdL0jkw+iSjeCOzE6H1TPCGuk4gjjbKY8YhnaC9ZTzR8XUcSJH9YRCXKf4OycYUP1tW1SPHwvckQ0VCGtPGK7q8+xKyko8AAceikc3mt2umN4h58T5m7kLjyh0IXEdoe1FlUhnYdeJ0b/AAQOxB+JCL3qb2v08CJ2HaLouhanUIhL2IsdCK0FyR91lERRD2i+LspDfWqpy5s5dTTZ1AVJ58Sr3XftQUkuBnDbIR5xN2MjhUnV/TB3Acju/DPh0+xRPvfK6m8UwkNY5w42dnP3JNmii2DVwxCnzk6ffeCcv/EKSkv30RM/eibwQs49qdnHsUpmkkSCZbRdakYy2i61AyNn83qkzFonCIW15+ClGMW1w6rKeCAwghQ94GPHiXlVO7JJst0u1+JC0MbRBIoQ0lDm5DfOWnx9j8CZOKBG0FtcHnKi9ILk5vF3quxdyerz7UycF0WWj8mH0RTtaOSPRFV6u/hSq7uFAsEWfSPNyW/ckepV6vN6VXm9FhgiZ43JFAR96jq838KTl38KBqKQ7l3IXdNV3cKZ383osdDu6jdO5eb1GT+b0rKSDaMQcob9XqmhLeP6mjgUbv3oXfuRYYh1wwzBL3ibwTFG81Oo3dC7qWzWMEHvpJKOaSmzXFBMJalRZcYU7AWyWjVdRCRcpSVFykkDRJDAjMRxsbxXWiDCC2QrOAjvpZ9IC7A8pszNJ3eTSXGAiA6sZdKLaoEWNCtB1b6I42KziehndndpK0zJonCPjwrYA4xC7EN9zzZ3a5n8uge1jCOPEGGQxYwvTlkE7ne+Tu73/FlfwRZIZwaYo1CJUU8el3/W5v0bjSwtY4AQRGFTDEp0jVJqmZ3n7WZ2f2JkHEZ+5Oxefao2LzUnYvNSAolq52lPV3KOrv1k7F3ICg6uclVzkFSepAUPV59qTl3oKknLv1kBQVXO0IXdNV3ayFy81ICh3JA7p3fzUgd/NSQ6GJ+9DPuTu/frIZ9yVlJDO/n2pifvS89aYlLNEgZpJppJGgzOjZ1EzqQGI+brFoSQNBs/n9E7P5vTNEozBH3kTER6vyt4KjNo6FhwkVnzSHgKoXdnlke52v0fBHbLbEtwfw6iyCQCUmbTdwv3LnTic3qTsUT1nz/VVZm10SUFslp1U0/NyUNiPMKrRi1Pe+jIn3os7G0Pm+zTxoENPv4E8+7gTUjXTjYs6skm9s0i5NWjGK5Ax6vNyJn83IWEuV0XRsJAdVJdbIE2hnYv/mXCmIf7nbQnI83FzbuDK+STOnNyo/hEWM75suHSz3oFYNJdj6Mn6IJ+blLvm2JZrNmvP48Hdcq5l58sga9ju6B3TO/m5EIYlR8WKOV/BIugX8U0+5FXX/LHTteKZ3H1RdJ27UikA7oCdG5QuV0mfuQPTtF0fqkWgZpk9I+tHr8Eyn2XaD33EzadmnK/0RtELN1cvF1uqrReUXn9E7ReSjIWBZY+V83gyTxC2deleoGjImLV+XvZPIWJMMYuTzaWkiqh163Nu6nVaY7RdH6qaHHiAFMIS8+xNMlx6Jp4mJCicqorupkIkOyNO1f4oSixzzi6RT7UFW2VWyI8KLJxJ2Lk80eHjdO7liltctma7iVdyLnbRdzcSaRbJIyDAthHiBmf3/VGUe0xQLOIdbHuu9qoyLZSkSeQnpos0l6osbZNKqKGrGH3voq0i2SSffM7G60rHgWRjRDOkCiVfFOUSJrkWnOB2/XIoTtFZjExhijnEOnj/AFRQo8UzEd/HS2MPDlysqslxe9CeKXrBL4d6AnI87u7tKkK0RK6TGHEyNo0OmNxD+LZCHGdypmga9cARKQxQISH4fGabfInRlmyfsUDOO1T7qUtgh7HUWaqPZK8bbHtTVQ+b54mZROUQNrtZSPTFCoBESHOpF/YhWwaSFi7Q9L6pKonUZPoun2RgJHqqVoRa9IqQQI1Zg2WtOOm3sOUq3KrAKlAC1BJXRs9B0gKtQcHkeet1o0ZPURyxhltCKNoG2RLuQMHCeYNXOuZWxsUMMWrG2Q8VS04mUtUzo2P+nE7EQ2Mq6gH5p9i0YWEvVj717qxDwbHPkjzmZPGPRD1q3ZmWsUQ9X5STNg0vMu91rAwUR6xFzZupWwIWsNPOkyKiT50uTINg8g1h+XxSKx8r5W8VsWwMO1D6+5IsEQ9oc3ZL4J+ifsR7Mc9io1h+XxQ+hltfK3itmOB4GvE1tUX+N7piwLAPWiFzRF+9Hof2I9mN9GieRfuQFZy2R94fFa6JgKH/AFB50J5fFndRPgXYtMP3q26nZKolLWj2ZJ7N/QEubPudBvdHrh5pdy01owYQYxlBLmmL9WXqVcbFXi1U7OnqdLCJotT0Z0oP9Tpj33pgstZ0nTzhLudduPYCDPhCXKG5/BVDspZ0IquTpb2JeFFrU6ObFsZQgqAlUcS1Cq5pX+K67CWbjKvGs3JHs7FE9FrY0jPhnP8AxeGN1pKbeQ4D6SSxs0onhkK6lmMVmYdrVqBbqNZaaWsluROFmjgDRn043KXQHHg4iz8DC0PNiiPOuXQg4QhnmRB5pXLozjLYwcGafBsIbXVDhYpUvrdnHoVreoFkDNGGQ6xCxP15FlwwgIGJb5SW0JSV8d0OJTaN5jjysvUmcWroTbtbHYhxRM/xSIsmcV3G3ErpBXSVI0+272LPQ8IYPMPwokSBF51Q9U3TvaqMb0mGXNJ26nSJei272NbBiwKKQKGJJnDkkXNksmOE+UJfB1OGFyDVH3buxRhQpaEjSYuyk5Q9n5lnftqJyuk6AsOFtcLfHKqpkfVkaAnHyTId7E/5ZF730WePDpesLrQFhSIe1731RTKXxpmpCJvQfixKdkSJnVG0Wms6oUUh5wda4X2lH1cVQxLbXnxEKNFr475OrbThnrQyK/ifiXNMB1BKrkqmdrhhyucTMo2wrRmEIjrafoqN4aTiqR1niCFNdMSnaHKoLTFwfFzLJvZCOMQFJuLLOej4ZVxbXhOFqVFzsnwZUYmEom12KXJLdmkdBk9qId+KlQk+JjqlGwgJ58WrmqnGt9eZiqJfIijdaR0XMZpLiekkkubyI2oqb4n31etfuRuU/LeCP2cPwS+5G5T8t4I/Zw/BfNzZvijyY0VE1oLaXrH7kblPy3gj9nD8EvuRuU/LeCP2cPwT8shYI8pDbYnrCUg4RicleqfuRuV/LeCP2cPwVe1bldx9lEd93PYImU6B9ChzeTO76OBlS159h40eYWwnE8kpQwxEDWXo18EbhPQytP2HgikRYyEbCDm02d5SYZzkJfBOOBtwmvgXBEKkojUxbEAviO7E8nHJc/wfgdUvk6i5F4kedvtyJr1J2w2XmS9FPgPcPWI/YGCsavG9AGTUSYmd6bnZ3ZpcN2W5MWBNw4nAFsB4GLfom9zaxw5MVLkzZMt0pNfN2uvVfb1OxeGJ53+3ovrCTPh6P6yJ0n7Jr0fH3N7iYBEMXAWBhIZVf9EDy0yubLK+XBfkTQNzm4i0R95gYEwMcQZ3DYw0PJ75SfT8OJH3NQXhieb3w5H9eXSfxQPhq0+sLpL0jadzu4uygMQ9z2CihnCKKMQLCBDSzTnNmle2RVPs3cNTV92sHS3zev8AAwpb7P8AhzyT0znTLSl9rU7H4Ynnf7Yia5F0kJYVi7XSJejxwNuLOkh3MWGmJvTgX2eEiaI7Mz5Lmm97vLimhPBW4kLSVnPc1g4YgxWhk3oEK6bizPk0uY3Z17PKV6X2tTsfiR5vfChclAWEom0vSlmwPuJtFpCzjuawcMRzcKSsULFJqrnllfELJOUpPJ7l1vuRuV/LeCP2cPwSfyJ9j8aPKJ22If8ANUTxuUvWf3I3KflvBH7OH4Jfcjcp+W8Efs4fgoerJhgjyU8VNvq9bfcjcp+W8Efs4fgl9yNyn5bwR+zh+CWbHijyRviS9b/cjcp+W8Efs4fgkpyY6NAkkkkMSSSSAEqtssUC3AI2kSMWepmYyG/2O00kkAU42AMHRTMiglNxkUoptPFIeHgJ2bgmnLAtgIohlBJ3MTYvxTvZ3d3bLwk78Tu7tlSSQAdowPYjI4hwyczdyJ2im03dmnp5LS4HZna9kA4Bwd6gsWJvjfinccpV5c6/LlnfOd6SSADj4IsUd3OLDiOROxO7Rja92pnc+Wm6fBdkUkDBljs8UTgwaSGdL1PdOeifG6dJABR7HBtEeEcRjrgzopiELXtJ5szsz3Kt9iYOpo9HkNG90sZMMpUzlOU5XTyyumkkgB4mCLE7xGcY340QCKm0RGZnGVMmquZpNc0mTtguxBEr3oiPfKpnFIr2F2bK73MzvJsjTuSSQAVnwbZLM4RocIniBORHEI3xpM7u7u83kzNPgaS6CSSAEkkkgBJJJIASSSSAP//Z')"};

  return (
    <AppLayout>
      <div 
        className="flex flex-col items-center justify-center text-center h-full pt-4 pb-16 bg-cover bg-center bg-no-repeat"
        style={backgroundImageStyle}
      >
        <CommanderPortrait 
          commanderSex={playerProfile.commanderSex} 
          onTap={handleTap} 
        />
        <p className="mt-20 text-lg font-semibold text-primary font-headline bg-background/70 p-1 rounded">
          Tap Commander to Generate Points
        </p>
        <p className="text-sm text-muted-foreground bg-background/70 p-1 rounded">
          Current Objective: {playerProfile.currentSeasonId ? playerProfile.seasonProgress[playerProfile.currentSeasonId] || 0 : 0} Points
        </p>

        <Button onClick={switchCommanderSex} variant="outline" className="mt-4 text-foreground hover:text-accent-foreground hover:bg-accent bg-background/70">
          {playerProfile.commanderSex === 'male' ? (
            <>Switch to <UserRound className="inline-block ml-1 mr-1 h-5 w-5" /> Female Commander</>
          ) : (
            <>Switch to <User className="inline-block ml-1 mr-1 h-5 w-5" /> Male Commander</>
          )}
        </Button>

        {playerProfile.equippedUniformPieces && playerProfile.equippedUniformPieces.length > 0 && (
          <div className="mt-6 text-center w-full max-w-xs p-3 bg-card/80 rounded-lg shadow">
            <h3 className="text-md font-semibold text-accent flex items-center justify-center">
              <ShieldEllipsis className="h-5 w-5 mr-2"/>
              Black Uniform Progress
            </h3>
            <ul className="mt-2 text-sm text-muted-foreground list-none p-0 space-y-1">
              {playerProfile.equippedUniformPieces.map(piece => (
                <li key={piece} className="flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                  <span>{piece}</span>
                </li>
              ))}
            </ul>
            {playerProfile.equippedUniformPieces.length < 5 && ( 
                 <p className="text-xs text-muted-foreground/70 mt-2">
                    Next piece at: { (playerProfile.equippedUniformPieces.length + 1) * 2000 } taps
                </p>
            )}
             {playerProfile.equippedUniformPieces.length === 5 && (
                 <p className="text-xs text-green-400 font-semibold mt-2">
                    Black Uniform Complete!
                </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
