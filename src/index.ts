import { Application, WsAuthService, SecurityService } from '@piros/tssf';
import { GvAuthService, GvSecurityService, DatabaseService } from '@piros/gv-server-commons';
import { StarsController } from './controller/stars-controller';
import { Injector } from '@piros/ioc';
import { AplicationStatusService, DefaultStatusProvider, ReplicaStatus } from '@piros/status';

class MyStatusProvider extends DefaultStatusProvider {

    constructor() {
        super();
    }

    public get defaultStatus(): ReplicaStatus {
        return {
            host: process.env.POD_IP,
            replicaData: 'nothing'
        }
    }
}

const injector = new Injector();

const ds: DatabaseService = injector.resolve(DatabaseService);

ds.execute(`

DROP TABLE IF EXISTS stars;
CREATE TABLE stars(
    id text PRIMARY KEY,
    name text,
    x real,
    y real,
    type integer,
    size integer
);

`, []).subscribe(()=>{
    injector.setProviders([
        { provide: WsAuthService, useClass: GvAuthService },
        { provide: SecurityService, useClass: GvSecurityService },
        { provide: DefaultStatusProvider, useClass: MyStatusProvider }
    ]);
    
    new Application({
        controllers: [
            StarsController
        ],
        channels: [ ]
    }, injector).start(<any>process.env.LISTEN_PORT);

    const statusService = injector.resolve(AplicationStatusService);
    statusService.getStatus().subscribe(status => {
        console.log('STATUS CHANGED:');
        console.log(status.services.get('gv-server-galaxy'));
    });
    
});

