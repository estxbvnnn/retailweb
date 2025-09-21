import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  loading = false;
  coords: { latitude: number; longitude: number } | null = null;
  address: any = null;
  error: string | null = null;

  constructor(private loc: LocationService) {}

  ngOnInit() {
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoic29sZGllcmhlYWQiLCJhIjoiY2xsd2lkdmcwMGhjZzNnbnNkZWFkNHh3ZyJ9.7uE86t38ERr4ItEamH7Kkg';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    });
  }

  async locate() {
    this.loading = true;
    this.error = null;
    this.address = null;
    try {
      const pos = await this.loc.getCurrentPosition();
      this.coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      this.address = await this.loc.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
    } catch (e: any) {
      this.error = e?.message || 'Error al obtener ubicación';
    } finally {
      this.loading = false;
    }
  }
}
