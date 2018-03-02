package ca.ubc.cs.cpsc210.translink.model;

import java.util.*;

/**
 * Manages all routes.
 *
 * Singleton pattern applied to ensure only a single instance of this class that
 * is globally accessible throughout application.
 */

public class RouteManager implements Iterable<Route> {
    private static RouteManager instance;
    // Use this field to hold all of the routes.
    // Do not change this field or its type, as the iterator method depends on it
    private Map<String, Route> routeMap;

    /**
     * Constructs Route manager with empty collection of routes
     */
    private RouteManager() {
        routeMap = new HashMap<>();
    }

    /**
     * Gets one and only instance of this class
     *
     * @return  instance of class
     */
    public static RouteManager getInstance() {
        // Do not modify the implementation of this method!
        if(instance == null) {
            instance = new RouteManager();
        }
        return instance;
    }

    /**
     * Get route with given number, creating it and adding it to the collection of all routes if necessary.
     * If it is necessary to create the route, give it an empty string "" as its name
     *
     * @param number  the number of this route
     *
     * @return  route with given number
     */
    public Route getRouteWithNumber(String number) {
        Route ret = routeMap.get(number);
        if (ret != null) return ret;

        ret = new Route(number);
        this.routeMap.put(number, ret);
        return ret;
    }

    /**
     * Get route with given number, creating it and adding it to the collection of all routes if necessary,
     * using the given name and number
     *
     * @param number  the number of this route
     *
     * @return  route with given number and name
     */
    public Route getRouteWithNumber(String number, String name) {
        Route ret = this.routeMap.get(number);
        if (ret != null) {
            ret.setName(name);
            return ret;
        }

        ret = new Route(number);
        this.routeMap.put(number, ret);
        return ret;
    }

    /**
     * Get number of routes managed
     *
     * @return  number of routes added to manager
     */
    public int getNumRoutes() {
        return this.routeMap.size();
    }

    @Override
    public Iterator<Route> iterator() {
        // Do not modify the implementation of this method!
        return routeMap.values().iterator();
    }

    /**
     * Remove all routes from the route manager
     */
    public void clearRoutes() {
        for (String routeNo : this.routeMap.keySet()) {
            Route r = this.routeMap.get(routeNo);
            for (Stop s : r.getStops()) {
                s.removeRoute(r);
            }
        }
        this.routeMap.clear();
    }
}
