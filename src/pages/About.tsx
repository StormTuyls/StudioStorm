export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-8">Over Studio Storm</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400"
                alt="Studio Storm"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4 text-gray-600">
            <p>
              Studio Storm is gespecialiseerd in sportfotografie met een focus op atletiek.
              We leggen de meest intense en emotionele momenten van sport vast - van de 
              sprintfinish op de piste tot de krachtige smash op de volleybalcourt.
            </p>
            <p>
              Met jarenlange ervaring in het fotograferen van diverse atletiekwedstrijden,
              van lokale veldlopen tot Diamond League meetings, begrijpen we het belang van 
              het juiste moment. We werken met professionele apparatuur en zijn getraind om 
              snel te reageren op de dynamiek van sport.
            </p>
            <p>
              Of het nu gaat om een lokale wedstrijd of een groot sportevenement, Studio Storm
              zorgt ervoor dat jouw belangrijkste momenten worden vastgelegd met de hoogste
              kwaliteit en oog voor detail. We hebben samengewerkt met organisaties zoals
              Atletieknieuws, Agones Media, en Runnerslab Athletics Team.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Onze Specialisaties</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Atletiek</h3>
              <p className="text-sm text-gray-500">Hoofdfocus - alle disciplines</p>
              <p className="text-gray-600 mt-2">
                Van veldlopen tot pistewedstrijden, van straatlopen tot Diamond League meetings.
                We leggen de intensiteit, emotie en schoonheid van atletiek vast.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Volleybal</h3>
              <p className="text-sm text-gray-500">Indoor sportfotografie</p>
              <p className="text-gray-600 mt-2">
                Dynamische actie op de court, van lokale competities tot landelijke bekers.
                Specialisatie in het vastleggen van snelle bewegingen en teamdynamiek.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Jiu-Jitsu</h3>
              <p className="text-sm text-gray-500">Vechtsportfotografie</p>
              <p className="text-gray-600 mt-2">
                Krachtige momenten uit de vechtsport, technische precisie en intense
                gevechten vastgelegd op het moment supreme.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Contact</h2>
          <p className="text-gray-600">
            Interesse in sportfotografie voor jouw team, club of evenement?
            Neem contact met ons op via{' '}
            <a href="https://instagram.com/studiostorm.sports" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              @studiostorm.sports
            </a>
            {' '}op Instagram of via ons contactformulier.
          </p>
        </div>
      </div>
    </div>
  );
}
