from spyne import Application, rpc, ServiceBase, Float
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
import math

class Service(ServiceBase) :
    @rpc(Float, Float, Float, _returns=(Float))
    def tempsTrajet(ctx, distance, autonomie, chargement):
        vMoyenne = 70

        if distance < autonomie :
            nbCharge = 0
        else :
            nbCharge = distance / autonomie
            nbCharge = math.floor(nbCharge)

        print(nbCharge)
            

        temps = nbCharge * chargement
        print(chargement)
        print(temps)
        temps += distance / vMoyenne

        return temps
    
    @rpc(Float, Float, Float, _returns=(Float))
    def prixTrajet(ctx, distance, autonomie, chargement):
        
        if distance < autonomie :
            nbCharge = 0
        else :
            nbCharge = distance / autonomie
            nbCharge = math.floor(nbCharge)

        prixH = 300
        return nbCharge * chargement * prixH / 60

application = Application([Service], 'spyne.examples.hello.soap',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11())
wsgi_application = WsgiApplication(application)

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    server = make_server('127.0.0.1', 8000, wsgi_application)
    server.serve_forever()