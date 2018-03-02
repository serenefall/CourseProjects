package ca.ubc.cs.cpsc210.translink.tests.parsers;

import ca.ubc.cs.cpsc210.translink.model.Route;
import ca.ubc.cs.cpsc210.translink.model.RouteManager;
import ca.ubc.cs.cpsc210.translink.model.RoutePattern;
import ca.ubc.cs.cpsc210.translink.parsers.RouteMapParser;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Test the parser for route pattern map information
 */

public class RouteMapParserTest {
    @Before
    public void setup() {
        RouteManager.getInstance().clearRoutes();
    }

    private int countNumRoutePatterns() {
        int count = 0;
        for (Route r : RouteManager.getInstance()) {
            for (RoutePattern rp : r.getPatterns()) {
                count ++;
            }
        }
        return count;
    }

    @Test
    public void testRouteParserNormal() {
        RouteMapParser p = new RouteMapParser("allroutemaps.txt");
        p.parse();
        assertEquals(1232, countNumRoutePatterns());
    }

    @Test
    public void testRouteParserEmptyFile() {
        RouteMapParser p = new RouteMapParser("zeroroutemaps.txt");
        p.parse();
        assertEquals(0, countNumRoutePatterns());
    }

    @Test
    public void testRouteParserOneEntry() {
        RouteMapParser p = new RouteMapParser("oneroutemaps.txt");
        p.parse();
        assertEquals(3, countNumRoutePatterns());
    }
}
